'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Save, Copy, Trash2, RotateCcw, AlertTriangle } from 'lucide-react';
import type { Project, ProjectType } from '@/lib/types';
import { useProjectStore } from '@/store/useProjectStore';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { cn } from '@/lib/utils';

interface Props {
    project: Project;
}

const projectTypes: ProjectType[] = ['ITX', 'Rack', 'NAS', 'Custom'];

export function ProjectSettings({ project }: Props) {
    const router = useRouter();
    const updateProject = useProjectStore((s) => s.updateProject);
    const deleteProject = useProjectStore((s) => s.deleteProject);
    const duplicateProject = useProjectStore((s) => s.duplicateProject);
    const resetProject = useProjectStore((s) => s.resetProject);

    const [name, setName] = useState(project.name);
    const [type, setType] = useState<ProjectType>(project.type);
    const [budget, setBudget] = useState(String(project.budget));
    const [saved, setSaved] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [resetOpen, setResetOpen] = useState(false);

    const handleSave = () => {
        updateProject(project.id, {
            name: name.trim() || project.name,
            type,
            budget: Number(budget) || project.budget,
        });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleDuplicate = () => {
        const newId = duplicateProject(project.id);
        if (newId) router.push(`/projects/${newId}`);
    };

    const handleDelete = () => {
        deleteProject(project.id);
        router.push('/');
    };

    const handleReset = () => {
        resetProject(project.id);
    };

    return (
        <div className="space-y-6 max-w-2xl">
            {/* Project Details */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-card border border-border p-6 space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Project Details</h3>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Name</label>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Type</label>
                    <div className="flex gap-2">
                        {projectTypes.map((t) => (
                            <button
                                key={t}
                                onClick={() => setType(t)}
                                className={cn(
                                    'px-4 py-2 rounded-lg text-sm font-medium transition-all border',
                                    type === t
                                        ? 'bg-blue-600 text-white border-blue-600'
                                        : 'bg-secondary text-foreground border-border hover:border-blue-500/30'
                                )}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Budget (USD)</label>
                    <input
                        type="number"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    />
                </div>

                <button
                    onClick={handleSave}
                    className={cn(
                        'inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all',
                        saved
                            ? 'bg-emerald-600 text-white'
                            : 'bg-blue-600 hover:bg-blue-500 text-white'
                    )}
                >
                    <Save className="w-4 h-4" />
                    {saved ? 'Saved!' : 'Save Changes'}
                </button>
            </motion.div>

            {/* Actions */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl bg-card border border-border p-6 space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Actions</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                        onClick={handleDuplicate}
                        className="flex items-center gap-3 p-4 rounded-xl bg-secondary hover:bg-accent border border-border hover:border-blue-500/20 transition-all text-left"
                    >
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500/10">
                            <Copy className="w-4 h-4 text-blue-400" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-foreground">Duplicate</p>
                            <p className="text-xs text-muted-foreground">Create a copy of this project</p>
                        </div>
                    </button>

                    <button
                        onClick={() => setResetOpen(true)}
                        className="flex items-center gap-3 p-4 rounded-xl bg-secondary hover:bg-accent border border-border hover:border-amber-500/20 transition-all text-left"
                    >
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-amber-500/10">
                            <RotateCcw className="w-4 h-4 text-amber-400" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-foreground">Reset</p>
                            <p className="text-xs text-muted-foreground">Reset all component statuses</p>
                        </div>
                    </button>
                </div>
            </motion.div>

            {/* Danger Zone */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-2xl border border-red-500/20 p-6">
                <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <h3 className="text-sm font-medium text-red-400 uppercase tracking-wider">Danger Zone</h3>
                </div>
                <button
                    onClick={() => setDeleteOpen(true)}
                    className="flex items-center gap-3 p-4 rounded-xl bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 hover:border-red-500/40 transition-all w-full text-left"
                >
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-500/10">
                        <Trash2 className="w-4 h-4 text-red-400" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-red-400">Delete Project</p>
                        <p className="text-xs text-muted-foreground">Permanently delete this project and all its data</p>
                    </div>
                </button>
            </motion.div>

            <ConfirmDialog
                open={deleteOpen}
                onClose={() => setDeleteOpen(false)}
                onConfirm={handleDelete}
                title="Delete Project"
                description={`Are you sure you want to delete "${project.name}"? This action cannot be undone.`}
                confirmLabel="Delete Project"
                variant="danger"
            />

            <ConfirmDialog
                open={resetOpen}
                onClose={() => setResetOpen(false)}
                onConfirm={handleReset}
                title="Reset Project"
                description="This will reset all component statuses to 'planned'. Are you sure?"
                confirmLabel="Reset"
                variant="default"
            />
        </div>
    );
}
