'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Server, HardDrive, Database, Wrench } from 'lucide-react';
import Link from 'next/link';
import { useProjectStore } from '@/store/useProjectStore';
import type { ProjectType } from '@/lib/types';
import { cn } from '@/lib/utils';

const projectTypes: { type: ProjectType; label: string; icon: React.ReactNode; description: string; gradient: string }[] = [
    { type: 'ITX', label: 'ITX Build', icon: <Server className="w-5 h-5" />, description: 'Compact mini-ITX server', gradient: 'from-blue-500 to-cyan-500' },
    { type: 'Rack', label: 'Rack Server', icon: <HardDrive className="w-5 h-5" />, description: 'Standard rack-mounted server', gradient: 'from-purple-500 to-pink-500' },
    { type: 'NAS', label: 'NAS Storage', icon: <Database className="w-5 h-5" />, description: 'Network attached storage', gradient: 'from-emerald-500 to-teal-500' },
    { type: 'Custom', label: 'Custom Build', icon: <Wrench className="w-5 h-5" />, description: 'Custom server configuration', gradient: 'from-orange-500 to-amber-500' },
];

export default function CreateProjectPage() {
    const router = useRouter();
    const addProject = useProjectStore((s) => s.addProject);
    const [name, setName] = useState('');
    const [type, setType] = useState<ProjectType>('ITX');
    const [budget, setBudget] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: Record<string, string> = {};
        if (!name.trim()) newErrors.name = 'Project name is required';
        if (!budget || Number(budget) <= 0) newErrors.budget = 'Budget must be greater than 0';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const id = addProject(name.trim(), type, Number(budget));
        router.push(`/projects/${id}`);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </Link>
                <h1 className="text-2xl font-bold text-foreground tracking-tight">Create New Project</h1>
                <p className="text-sm text-muted-foreground mt-1">Set up a new server build project</p>
            </motion.div>

            <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                onSubmit={handleSubmit}
                className="space-y-6"
            >
                {/* Project Name */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Project Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => { setName(e.target.value); setErrors((prev) => ({ ...prev, name: '' })); }}
                        placeholder="My Server Build"
                        className={cn(
                            'w-full px-4 py-3 rounded-xl bg-secondary border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all',
                            errors.name ? 'border-red-500' : 'border-border'
                        )}
                    />
                    {errors.name && <p className="text-xs text-red-400">{errors.name}</p>}
                </div>

                {/* Project Type */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Project Type</label>
                    <div className="grid grid-cols-2 gap-3">
                        {projectTypes.map((pt) => (
                            <button
                                key={pt.type}
                                type="button"
                                onClick={() => setType(pt.type)}
                                className={cn(
                                    'flex items-start gap-3 p-4 rounded-xl border transition-all duration-200 text-left',
                                    type === pt.type
                                        ? 'border-blue-500/50 bg-blue-500/5 shadow-md shadow-blue-500/5'
                                        : 'border-border bg-card hover:border-blue-500/20 hover:bg-secondary'
                                )}
                            >
                                <div className={cn('flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br text-white shrink-0', pt.gradient)}>
                                    {pt.icon}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-foreground">{pt.label}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">{pt.description}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Budget */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Budget (USD)</label>
                    <input
                        type="number"
                        value={budget}
                        onChange={(e) => { setBudget(e.target.value); setErrors((prev) => ({ ...prev, budget: '' })); }}
                        placeholder="3500"
                        min="0"
                        step="100"
                        className={cn(
                            'w-full px-4 py-3 rounded-xl bg-secondary border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all',
                            errors.budget ? 'border-red-500' : 'border-border'
                        )}
                    />
                    {errors.budget && <p className="text-xs text-red-400">{errors.budget}</p>}
                </div>

                {/* Submit */}
                <div className="flex gap-3 pt-4">
                    <Link
                        href="/"
                        className="px-6 py-3 rounded-xl bg-secondary hover:bg-accent transition-colors text-sm font-medium text-foreground border border-border"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-sm font-medium transition-all shadow-lg shadow-blue-500/20"
                    >
                        Create Project
                    </button>
                </div>
            </motion.form>
        </div>
    );
}
