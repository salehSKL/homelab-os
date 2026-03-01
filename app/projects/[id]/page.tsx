'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, LayoutDashboard, Cpu, BarChart3, Settings } from 'lucide-react';
import Link from 'next/link';
import { useProjectStore } from '@/store/useProjectStore';
import { TypeBadge } from '@/components/common/TypeBadge';
import { ProgressBar } from '@/components/common/ProgressBar';
import { calculateProgress, formatCurrency, calculateTotalSpent, calculateTotalCost, getStatusCounts } from '@/lib/utils';
import { PROJECT_TYPE_COLORS } from '@/lib/types';
import { cn } from '@/lib/utils';
import { ProjectComponents } from '@/components/project/ProjectComponents';
import { ProjectAnalytics } from '@/components/project/ProjectAnalytics';
import { ProjectSettings } from '@/components/project/ProjectSettings';

const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'components', label: 'Components', icon: Cpu },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
] as const;

type TabId = (typeof tabs)[number]['id'];

export default function ProjectDetailPage() {
    const params = useParams();
    const projectId = params.id as string;
    const project = useProjectStore((s) => s.projects.find((p) => p.id === projectId));
    const isLoading = useProjectStore((s) => s.isLoading);
    const [activeTab, setActiveTab] = useState<TabId>('overview');

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="h-12 w-48 rounded-xl bg-card border border-border animate-pulse" />
                <div className="h-48 rounded-2xl bg-card border border-border animate-pulse" />
            </div>
        );
    }

    if (!project) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <h2 className="text-xl font-semibold text-foreground mb-2">Project Not Found</h2>
                <p className="text-sm text-muted-foreground mb-6">The project you&apos;re looking for doesn&apos;t exist.</p>
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-sm font-medium"
                >
                    Back to Dashboard
                </Link>
            </div>
        );
    }

    const progress = calculateProgress(project.components);
    const totalCost = calculateTotalCost(project.components);
    const totalSpent = calculateTotalSpent(project.components);
    const statusCounts = getStatusCounts(project.components);

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <Link
                    href="/projects"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
                >
                    <ArrowLeft className="w-4 h-4" />
                    All Projects
                </Link>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <h1 className="text-2xl font-bold text-foreground tracking-tight">{project.name}</h1>
                    <TypeBadge type={project.type} />
                </div>
            </motion.div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 bg-secondary rounded-xl overflow-x-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            'relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap',
                            activeTab === tab.id ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                        )}
                    >
                        {activeTab === tab.id && (
                            <motion.div
                                layoutId="project-tab"
                                className="absolute inset-0 bg-card border border-border rounded-lg shadow-sm"
                                transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                            />
                        )}
                        <tab.icon className="w-4 h-4 relative z-10" />
                        <span className="relative z-10">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
            >
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        {/* Progress */}
                        <div className="rounded-2xl bg-card border border-border p-6">
                            <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">Build Progress</h3>
                            <ProgressBar value={progress} size="lg" gradient={PROJECT_TYPE_COLORS[project.type]} />
                        </div>

                        {/* Budget & Status */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="rounded-2xl bg-card border border-border p-6">
                                <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">Budget Summary</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between py-2 border-b border-border">
                                        <span className="text-sm text-muted-foreground">Budget</span>
                                        <span className="text-sm font-semibold text-foreground">{formatCurrency(project.budget)}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2 border-b border-border">
                                        <span className="text-sm text-muted-foreground">Total Cost</span>
                                        <span className="text-sm font-semibold text-foreground">{formatCurrency(totalCost)}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2 border-b border-border">
                                        <span className="text-sm text-muted-foreground">Spent</span>
                                        <span className="text-sm font-semibold text-emerald-400">{formatCurrency(totalSpent)}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2">
                                        <span className="text-sm text-muted-foreground">Remaining</span>
                                        <span className={cn('text-sm font-semibold', project.budget - totalCost >= 0 ? 'text-foreground' : 'text-red-400')}>
                                            {formatCurrency(project.budget - totalCost)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-2xl bg-card border border-border p-6">
                                <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">Status Summary</h3>
                                <div className="space-y-3">
                                    {(['planned', 'ordered', 'delivered', 'installed'] as const).map((status) => (
                                        <div key={status} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                                            <div className="flex items-center gap-2">
                                                <div className={cn(
                                                    'w-2 h-2 rounded-full',
                                                    status === 'planned' && 'bg-blue-400',
                                                    status === 'ordered' && 'bg-amber-400',
                                                    status === 'delivered' && 'bg-purple-400',
                                                    status === 'installed' && 'bg-emerald-400'
                                                )} />
                                                <span className="text-sm text-muted-foreground capitalize">{status}</span>
                                            </div>
                                            <span className="text-sm font-semibold text-foreground">{statusCounts[status]}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'components' && <ProjectComponents project={project} />}
                {activeTab === 'analytics' && <ProjectAnalytics project={project} />}
                {activeTab === 'settings' && <ProjectSettings project={project} />}
            </motion.div>
        </div>
    );
}
