'use client';

import { useProjectStore } from '@/store/useProjectStore';
import { StatCard } from '@/components/dashboard/StatCard';
import { ProjectCard } from '@/components/dashboard/ProjectCard';
import { EmptyState } from '@/components/common/EmptyState';
import { motion } from 'framer-motion';
import { FolderKanban, TrendingUp, DollarSign, CircleDollarSign, PlusCircle, Server } from 'lucide-react';
import Link from 'next/link';
import { calculateProgress, formatCurrency, calculateTotalSpent, calculateTotalCost } from '@/lib/utils';

export default function DashboardPage() {
  const projects = useProjectStore((s) => s.projects);
  const initialized = useProjectStore((s) => s.initialized);

  if (!initialized) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 rounded-2xl bg-card border border-border animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const totalProjects = projects.length;
  const allComponents = projects.flatMap((p) => p.components);
  const globalProgress = allComponents.length > 0
    ? Math.round(allComponents.filter((c) => c.status === 'installed').length / allComponents.length * 100)
    : 0;
  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
  const totalSpent = projects.reduce((sum, p) => sum + calculateTotalSpent(p.components), 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Overview of all your server build projects</p>
        </div>
        <Link
          href="/create"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-sm font-medium hover:from-blue-500 hover:to-cyan-500 transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30"
        >
          <PlusCircle className="w-4 h-4" />
          New Project
        </Link>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Projects"
          value={totalProjects}
          icon={<FolderKanban className="w-4 h-4 text-blue-400" />}
          description={`${allComponents.length} total components`}
          gradient="from-blue-500/10 to-cyan-500/10"
          index={0}
        />
        <StatCard
          title="Global Progress"
          value={`${globalProgress}%`}
          icon={<TrendingUp className="w-4 h-4 text-emerald-400" />}
          description="Components installed"
          gradient="from-emerald-500/10 to-teal-500/10"
          index={1}
        />
        <StatCard
          title="Total Budget"
          value={formatCurrency(totalBudget)}
          icon={<DollarSign className="w-4 h-4 text-amber-400" />}
          description="Across all projects"
          gradient="from-amber-500/10 to-orange-500/10"
          index={2}
        />
        <StatCard
          title="Total Spent"
          value={formatCurrency(totalSpent)}
          icon={<CircleDollarSign className="w-4 h-4 text-purple-400" />}
          description={totalBudget > 0 ? `${Math.round((totalSpent / totalBudget) * 100)}% of budget` : 'No budget set'}
          gradient="from-purple-500/10 to-pink-500/10"
          index={3}
        />
      </div>

      {/* Projects */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Recent Projects</h2>
          {projects.length > 0 && (
            <Link
              href="/projects"
              className="text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors"
            >
              View All →
            </Link>
          )}
        </div>
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
            {projects.slice(0, 6).map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
