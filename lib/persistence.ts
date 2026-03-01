import type { Project } from './types';

const STORAGE_KEY = 'homelab-os-projects';

export function loadProjects(): Project[] | null {
    if (typeof window === 'undefined') return null;
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (!data) return null;
        return JSON.parse(data) as Project[];
    } catch {
        console.error('Failed to load projects from localStorage');
        return null;
    }
}

export function saveProjects(projects: Project[]): void {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch {
        console.error('Failed to save projects to localStorage');
    }
}

export function exportProjectsJSON(projects: Project[]): string {
    return JSON.stringify(projects, null, 2);
}

export function importProjectsJSON(json: string): Project[] | null {
    try {
        const parsed = JSON.parse(json);
        if (Array.isArray(parsed)) return parsed as Project[];
        if (parsed && typeof parsed === 'object' && parsed.id) return [parsed as Project];
        return null;
    } catch {
        return null;
    }
}
