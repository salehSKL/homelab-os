import { create } from 'zustand';
import { Project, Component, ProjectType, ComponentStatus } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';

export interface ProjectStore {
    projects: Project[];
    isLoading: boolean;
    error: string | null;

    fetchProjects: () => Promise<void>;

    addProject: (name: string, type: ProjectType, budget: number) => Promise<string | undefined>;
    updateProject: (id: string, data: Partial<Project>) => Promise<void>;
    deleteProject: (id: string) => Promise<void>;
    duplicateProject: (id: string) => Promise<string | undefined>;
    resetProject: (id: string) => Promise<void>;

    addComponent: (projectId: string, component: Omit<Component, 'id'>) => Promise<void>;
    updateComponent: (projectId: string, componentId: string, data: Partial<Component>) => Promise<void>;
    deleteComponent: (projectId: string, componentId: string) => Promise<void>;
    reorderComponents: (projectId: string, startIndex: number, endIndex: number) => Promise<void>;
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
    projects: [],
    isLoading: true,
    error: null,

    fetchProjects: async () => {
        set({ isLoading: true, error: null });
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            set({ projects: [], isLoading: false });
            return;
        }

        // Fetch projects and components in one query using postgrest relation
        const { data, error } = await supabase
            .from('projects')
            .select(`
        *,
        components (*)
      `)
            .order('created_at', { ascending: false });

        if (error) {
            set({ error: error.message, isLoading: false });
            return;
        }

        // Map the database rows back to our Frontend Project types
        const typedProjects: Project[] = (data || []).map((p: any) => ({
            id: p.id,
            name: p.name,
            type: p.type as ProjectType,
            budget: Number(p.budget),
            createdAt: p.created_at,
            components: (p.components || []).map((c: any) => ({
                id: c.id,
                name: c.name,
                price: Number(c.price),
                status: c.status as ComponentStatus,
                category: c.category,
            })),
        }));

        set({ projects: typedProjects, isLoading: false });
    },

    addProject: async (name, type, budget) => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
            .from('projects')
            .insert({
                user_id: user.id,
                name,
                type,
                budget,
            })
            .select()
            .single();

        if (error) {
            set({ error: error.message });
            return;
        }

        const newProject: Project = {
            id: data.id,
            name: data.name,
            type: data.type as ProjectType,
            budget: Number(data.budget),
            createdAt: data.created_at,
            components: [],
        };

        set((state) => ({ projects: [newProject, ...state.projects] }));
        return data.id;
    },

    updateProject: async (id, data) => {
        const supabase = createClient();

        // Update local state first (Optimistic)
        set((state) => ({
            projects: state.projects.map((p) => (p.id === id ? { ...p, ...data } : p)),
        }));

        // Update DB
        const updatePayload: any = {};
        if (data.name !== undefined) updatePayload.name = data.name;
        if (data.type !== undefined) updatePayload.type = data.type;
        if (data.budget !== undefined) updatePayload.budget = data.budget;

        const { error } = await supabase.from('projects').update(updatePayload).eq('id', id);
        if (error) {
            // If error, rollback by re-fetching
            await get().fetchProjects();
            set({ error: error.message });
        }
    },

    deleteProject: async (id) => {
        const supabase = createClient();

        // Optimistic
        set((state) => ({
            projects: state.projects.filter((p) => p.id !== id),
        }));

        const { error } = await supabase.from('projects').delete().eq('id', id);
        if (error) {
            await get().fetchProjects();
            set({ error: error.message });
        }
    },

    duplicateProject: async (id) => {
        const supabase = createClient();
        const state = get();
        const projectToDuplicate = state.projects.find((p) => p.id === id);
        if (!projectToDuplicate) return;

        // Create new project in DB
        const newProjectId = await state.addProject(
            `${projectToDuplicate.name} (Copy)`,
            projectToDuplicate.type,
            projectToDuplicate.budget
        );

        if (!newProjectId) return;

        // Copy components
        if (projectToDuplicate.components.length > 0) {
            const componentsToInsert = projectToDuplicate.components.map(c => ({
                project_id: newProjectId,
                name: c.name,
                category: c.category,
                price: c.price,
                status: 'planned' // Reset status on duplicate
            }));

            const { error } = await supabase.from('components').insert(componentsToInsert);

            if (!error) {
                // Reload to get components
                await state.fetchProjects();
            } else {
                set({ error: error.message });
            }
        }

        return newProjectId;
    },

    resetProject: async (id) => {
        const supabase = createClient();

        // Optimistic update
        set((state) => ({
            projects: state.projects.map((p) => {
                if (p.id !== id) return p;
                return {
                    ...p,
                    components: p.components.map((c) => ({ ...c, status: 'planned' as ComponentStatus })),
                };
            }),
        }));

        // Update all components for this project in DB
        const { error } = await supabase
            .from('components')
            .update({ status: 'planned' })
            .eq('project_id', id);

        if (error) {
            await get().fetchProjects();
            set({ error: error.message });
        }
    },

    addComponent: async (projectId, componentData) => {
        const supabase = createClient();

        const { data, error } = await supabase
            .from('components')
            .insert({
                project_id: projectId,
                name: componentData.name,
                category: componentData.category,
                price: componentData.price,
                status: componentData.status,
            })
            .select()
            .single();

        if (error) {
            set({ error: error.message });
            return;
        }

        const newComponent: Component = {
            id: data.id,
            name: data.name,
            category: data.category,
            price: Number(data.price),
            status: data.status as ComponentStatus,
        };

        set((state) => ({
            projects: state.projects.map((p) => {
                if (p.id !== projectId) return p;
                return { ...p, components: [...p.components, newComponent] };
            }),
        }));
    },

    updateComponent: async (projectId, componentId, data) => {
        const supabase = createClient();

        // Optimistic
        set((state) => ({
            projects: state.projects.map((p) => {
                if (p.id !== projectId) return p;
                return {
                    ...p,
                    components: p.components.map((c) => (c.id === componentId ? { ...c, ...data } : c)),
                };
            }),
        }));

        const updatePayload: any = {};
        if (data.name !== undefined) updatePayload.name = data.name;
        if (data.category !== undefined) updatePayload.category = data.category;
        if (data.price !== undefined) updatePayload.price = data.price;
        if (data.status !== undefined) updatePayload.status = data.status;

        const { error } = await supabase.from('components').update(updatePayload).eq('id', componentId);

        if (error) {
            await get().fetchProjects();
            set({ error: error.message });
        }
    },

    deleteComponent: async (projectId, componentId) => {
        const supabase = createClient();

        // Optimistic
        set((state) => ({
            projects: state.projects.map((p) => {
                if (p.id !== projectId) return p;
                return { ...p, components: p.components.filter((c) => c.id !== componentId) };
            }),
        }));

        const { error } = await supabase.from('components').delete().eq('id', componentId);

        if (error) {
            await get().fetchProjects();
            set({ error: error.message });
        }
    },

    reorderComponents: async (projectId, startIndex, endIndex) => {
        // Reordering is purely frontend UX for now unless we add an 'order_index' column to the DB
        // For this exact implementation we will just stick it in local state.
        set((state) => ({
            projects: state.projects.map((p) => {
                if (p.id !== projectId) return p;
                const result = Array.from(p.components);
                const [removed] = result.splice(startIndex, 1);
                result.splice(endIndex, 0, removed);
                return { ...p, components: result };
            }),
        }));
    }

}));
