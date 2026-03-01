'use client';

import { useProjectStore } from '@/store/useProjectStore';
import { ProjectCard } from '@/components/dashboard/ProjectCard';
import { EmptyState } from '@/components/common/EmptyState';
import { motion } from 'framer-motion';
import { PlusCircle, Server } from 'lucide-react';
import Link from 'next/link';

export default function ProjectsPage() {
    const projects = useProjectStore((s) => s.projects);
    const isLoading = useProjectStore((s) => s.isLoading);

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-8">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-48 rounded-2xl bg-card border border-border animate-pulse" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
                <div>
                    <h1 className="text-2xl font-bold text-foreground tracking-tight">Projects</h1>
                    <p className="text-sm text-muted-foreground mt-1">{projects.length} project{projects.length !== 1 ? 's' : ''} total</p>
                </div>
                <Link
                    href="/create"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-sm font-medium hover:from-blue-500 hover:to-cyan-500 transition-all shadow-lg shadow-blue-500/20"
                >
                    <PlusCircle className="w-4 h-4" />
                    New Project
                </Link>
            </motion.div>

            {projects.length === 0 ? (
                <EmptyState
                    icon={<Server className="w-7 h-7 text-muted-foreground" />}
                    title="No projects yet"
                    description="Create your first server build project to get started."
                    action={
                        <Link
                            href="/create"
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-sm font-medium"
                        >
                            <PlusCircle className="w-4 h-4" />
                            Create Project
                        </Link>
                    }
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {projects.map((project, i) => (
                        <ProjectCard key={project.id} project={project} index={i} />
                    ))}
                </div>
            )}
        </div>
    );
}
