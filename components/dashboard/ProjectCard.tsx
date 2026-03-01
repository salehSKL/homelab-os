'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { Project } from '@/lib/types';
import { calculateProgress, formatCurrency, calculateTotalCost } from '@/lib/utils';
import { TypeBadge } from '@/components/common/TypeBadge';
import { ProgressBar } from '@/components/common/ProgressBar';
import { PROJECT_TYPE_COLORS } from '@/lib/types';

interface ProjectCardProps {
    project: Project;
    index?: number;
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
    const progress = calculateProgress(project.components);
    const totalCost = calculateTotalCost(project.components);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
        >
            <Link href={`/projects/${project.id}`}>
                <div className="group relative overflow-hidden rounded-2xl bg-card border border-border p-5 transition-all duration-300 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/5 cursor-pointer">
                    {/* Top gradient line */}
                    <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${PROJECT_TYPE_COLORS[project.type]} opacity-60`} />

                    <div className="flex items-start justify-between mb-3">
                        <div>
                            <h3 className="text-base font-semibold text-foreground group-hover:text-blue-400 transition-colors">
                                {project.name}
                            </h3>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                {project.components.length} components
                            </p>
                        </div>
                        <TypeBadge type={project.type} />
                    </div>

                    <ProgressBar value={progress} size="sm" gradient={PROJECT_TYPE_COLORS[project.type]} className="mb-3" />

                    <div className="flex items-center justify-between">
                        <div className="flex gap-4">
                            <div>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Budget</p>
                                <p className="text-sm font-semibold text-foreground">{formatCurrency(project.budget)}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Cost</p>
                                <p className="text-sm font-semibold text-foreground">{formatCurrency(totalCost)}</p>
                            </div>
                        </div>
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary group-hover:bg-blue-500/10 transition-colors">
                            <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-blue-400 transition-colors" />
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
