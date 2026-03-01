'use client';

import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { Project } from '@/lib/types';
import { getStatusCounts, formatCurrency, formatDate } from '@/lib/utils';
import { StatusBadge } from '@/components/common/StatusBadge';
import type { ComponentStatus } from '@/lib/types';

interface Props {
    project: Project;
}

const STATUS_CHART_COLORS: Record<ComponentStatus, string> = {
    planned: '#3b82f6',
    ordered: '#f59e0b',
    delivered: '#a855f7',
    installed: '#10b981',
};

export function ProjectAnalytics({ project }: Props) {
    const statusCounts = getStatusCounts(project.components);

    const pieData = Object.entries(statusCounts)
        .filter(([, count]) => count > 0)
        .map(([status, count]) => ({
            name: status.charAt(0).toUpperCase() + status.slice(1),
            value: count,
            color: STATUS_CHART_COLORS[status as ComponentStatus],
        }));

    // Budget breakdown by category
    const categoryMap = new Map<string, number>();
    project.components.forEach((c) => {
        categoryMap.set(c.category, (categoryMap.get(c.category) || 0) + c.price);
    });
    const barData = Array.from(categoryMap.entries()).map(([category, total]) => ({
        category,
        total,
    }));

    // Timeline
    const timeline = [...project.components]
        .sort((a, b) => {
            const order: Record<ComponentStatus, number> = { installed: 0, delivered: 1, ordered: 2, planned: 3 };
            return order[a.status] - order[b.status];
        });

    if (project.components.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <h3 className="text-lg font-semibold text-foreground mb-1">No Data Yet</h3>
                <p className="text-sm text-muted-foreground">Add components to see analytics.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pie Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl bg-card border border-border p-6"
                >
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Status Distribution</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={90}
                                    paddingAngle={4}
                                    dataKey="value"
                                    animationBegin={200}
                                    animationDuration={800}
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'hsl(222 47% 8%)',
                                        border: '1px solid hsl(217 33% 18%)',
                                        borderRadius: '12px',
                                        padding: '8px 12px',
                                        fontSize: '12px',
                                        color: 'hsl(210 40% 98%)',
                                    }}
                                />
                                <Legend
                                    formatter={(value) => <span style={{ color: 'hsl(215 20% 55%)', fontSize: '12px' }}>{value}</span>}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Bar Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="rounded-2xl bg-card border border-border p-6"
                >
                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Budget by Category</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 33% 18%)" />
                                <XAxis dataKey="category" tick={{ fill: 'hsl(215 20% 55%)', fontSize: 11 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: 'hsl(215 20% 55%)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'hsl(222 47% 8%)',
                                        border: '1px solid hsl(217 33% 18%)',
                                        borderRadius: '12px',
                                        padding: '8px 12px',
                                        fontSize: '12px',
                                        color: 'hsl(210 40% 98%)',
                                    }}
                                    formatter={(value) => [formatCurrency(Number(value)), 'Total']}
                                />
                                <Bar dataKey="total" fill="url(#barGradient)" radius={[6, 6, 0, 0]} animationDuration={800} animationBegin={300} />
                                <defs>
                                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#3b82f6" />
                                        <stop offset="100%" stopColor="#06b6d4" />
                                    </linearGradient>
                                </defs>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            {/* Timeline */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-2xl bg-card border border-border p-6"
            >
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Component Timeline</h3>
                <div className="space-y-3">
                    {timeline.map((component, i) => (
                        <motion.div
                            key={component.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex items-center gap-4 py-2 border-b border-border last:border-0"
                        >
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">{component.name}</p>
                                <p className="text-xs text-muted-foreground">{component.category} · {formatCurrency(component.price)}</p>
                            </div>
                            <StatusBadge status={component.status} />
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
}
