'use client';

import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { Project, Component, ProjectType, ComponentStatus, ComponentCategory } from '@/lib/types';
import { loadProjects, saveProjects } from '@/lib/persistence';

interface ProjectStore {
    projects: Project[];
    initialized: boolean;
    initialize: () => void;
    addProject: (name: string, type: ProjectType, budget: number) => string;
    updateProject: (id: string, updates: Partial<Omit<Project, 'id' | 'components'>>) => void;
    deleteProject: (id: string) => void;
    duplicateProject: (id: string) => string | null;
    resetProject: (id: string) => void;
    addComponent: (projectId: string, name: string, category: ComponentCategory, price: number) => void;
    updateComponent: (projectId: string, componentId: string, updates: Partial<Omit<Component, 'id'>>) => void;
    deleteComponent: (projectId: string, componentId: string) => void;
    reorderComponents: (projectId: string, components: Component[]) => void;
    importProjects: (projects: Project[]) => void;
    getProject: (id: string) => Project | undefined;
}

function createSampleProject(): Project {
    return {
        id: uuidv4(),
        name: 'ITX Server Build',
        type: 'ITX',
        budget: 3500,
        createdAt: new Date().toISOString(),
        components: [
            { id: uuidv4(), name: 'Fractal Design Terra', category: 'Case', price: 150, status: 'installed' },
            { id: uuidv4(), name: 'AMD Ryzen 9 5950X', category: 'CPU', price: 550, status: 'installed' },
            { id: uuidv4(), name: 'ASUS ROG Strix X570-I', category: 'Motherboard', price: 280, status: 'installed' },
            { id: uuidv4(), name: 'Noctua NH-L12S', category: 'Cooler', price: 55, status: 'delivered' },
            { id: uuidv4(), name: 'Corsair SF750', category: 'PSU', price: 145, status: 'installed' },
            { id: uuidv4(), name: 'Corsair Vengeance DDR4 64GB', category: 'RAM', price: 180, status: 'ordered' },
            { id: uuidv4(), name: 'Samsung 990 PRO 2TB', category: 'Storage', price: 210, status: 'installed' },
            { id: uuidv4(), name: 'Crucial P5 Plus 4TB', category: 'Storage', price: 320, status: 'planned' },
            { id: uuidv4(), name: 'Noctua NF-A12x25', category: 'Fan', price: 32, status: 'delivered' },
            { id: uuidv4(), name: 'UPS 1500VA', category: 'UPS', price: 200, status: 'planned' },
        ],
    };
}

const persist = (projects: Project[]) => {
    saveProjects(projects);
};

export const useProjectStore = create<ProjectStore>((set, get) => ({
    projects: [],
    initialized: false,

    initialize: () => {
        if (get().initialized) return;
        const saved = loadProjects();
        if (saved && saved.length > 0) {
            set({ projects: saved, initialized: true });
        } else {
            const sample = [createSampleProject()];
            persist(sample);
            set({ projects: sample, initialized: true });
        }
    },

    addProject: (name, type, budget) => {
        const id = uuidv4();
        const newProject: Project = {
            id,
            name,
            type,
            budget,
            createdAt: new Date().toISOString(),
            components: [],
        };
        set((state) => {
            const updated = [...state.projects, newProject];
            persist(updated);
            return { projects: updated };
        });
        return id;
    },

    updateProject: (id, updates) => {
        set((state) => {
            const updated = state.projects.map((p) => (p.id === id ? { ...p, ...updates } : p));
            persist(updated);
            return { projects: updated };
        });
    },

    deleteProject: (id) => {
        set((state) => {
            const updated = state.projects.filter((p) => p.id !== id);
            persist(updated);
            return { projects: updated };
        });
    },

    duplicateProject: (id) => {
        const project = get().projects.find((p) => p.id === id);
        if (!project) return null;
        const newId = uuidv4();
        const duplicate: Project = {
            ...project,
            id: newId,
            name: `${project.name} (Copy)`,
            createdAt: new Date().toISOString(),
            components: project.components.map((c) => ({ ...c, id: uuidv4() })),
        };
        set((state) => {
            const updated = [...state.projects, duplicate];
            persist(updated);
            return { projects: updated };
        });
        return newId;
    },

    resetProject: (id) => {
        set((state) => {
            const updated = state.projects.map((p) =>
                p.id === id
                    ? { ...p, components: p.components.map((c) => ({ ...c, status: 'planned' as ComponentStatus })) }
                    : p
            );
            persist(updated);
            return { projects: updated };
        });
    },

    addComponent: (projectId, name, category, price) => {
        const newComponent: Component = {
            id: uuidv4(),
            name,
            category,
            price,
            status: 'planned',
        };
        set((state) => {
            const updated = state.projects.map((p) =>
                p.id === projectId ? { ...p, components: [...p.components, newComponent] } : p
            );
            persist(updated);
            return { projects: updated };
        });
    },

    updateComponent: (projectId, componentId, updates) => {
        set((state) => {
            const updated = state.projects.map((p) =>
                p.id === projectId
                    ? { ...p, components: p.components.map((c) => (c.id === componentId ? { ...c, ...updates } : c)) }
                    : p
            );
            persist(updated);
            return { projects: updated };
        });
    },

    deleteComponent: (projectId, componentId) => {
        set((state) => {
            const updated = state.projects.map((p) =>
                p.id === projectId ? { ...p, components: p.components.filter((c) => c.id !== componentId) } : p
            );
            persist(updated);
            return { projects: updated };
        });
    },

    reorderComponents: (projectId, components) => {
        set((state) => {
            const updated = state.projects.map((p) => (p.id === projectId ? { ...p, components } : p));
            persist(updated);
            return { projects: updated };
        });
    },

    importProjects: (projects) => {
        set((state) => {
            const updated = [...state.projects, ...projects.map((p) => ({ ...p, id: uuidv4() }))];
            persist(updated);
            return { projects: updated };
        });
    },

    getProject: (id) => {
        return get().projects.find((p) => p.id === id);
    },
}));
