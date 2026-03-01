'use client';

import { useEffect } from 'react';
import { useProjectStore } from '@/store/useProjectStore';
import { useAuth } from '@/components/auth/AuthProvider';

export function StoreInitializer() {
    const fetchProjects = useProjectStore((s) => s.fetchProjects);
    const { user, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading && user) {
            fetchProjects();
        } else if (!isLoading && !user) {
            useProjectStore.setState({ projects: [], isLoading: false });
        }
    }, [fetchProjects, user, isLoading]);

    return null;
}
