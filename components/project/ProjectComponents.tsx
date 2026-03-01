'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, GripVertical, Check, X, Pencil } from 'lucide-react';
import type { Project, Component, ComponentCategory, ComponentStatus } from '@/lib/types';
import { CATEGORY_OPTIONS, STATUS_COLORS } from '@/lib/types';
import { useProjectStore } from '@/store/useProjectStore';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { EmptyState } from '@/components/common/EmptyState';
import { formatCurrency, cn } from '@/lib/utils';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Props {
    project: Project;
}

function SortableItem({ component, projectId }: { component: Component; projectId: string }) {
    const updateComponent = useProjectStore((s) => s.updateComponent);
    const deleteComponent = useProjectStore((s) => s.deleteComponent);
    const [editing, setEditing] = useState(false);
    const [editName, setEditName] = useState(component.name);
    const [editPrice, setEditPrice] = useState(String(component.price));
    const [editCategory, setEditCategory] = useState<ComponentCategory>(component.category);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: component.id });
    const style = { transform: CSS.Transform.toString(transform), transition };

    const handleSave = () => {
        updateComponent(projectId, component.id, {
            name: editName.trim() || component.name,
            price: Number(editPrice) || component.price,
            category: editCategory,
        });
        setEditing(false);
    };

    const handleStatusChange = (status: ComponentStatus) => {
        updateComponent(projectId, component.id, { status });
    };

    return (
        <>
            <motion.div
                ref={setNodeRef}
                style={style}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: isDragging ? 0.5 : 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={cn(
                    'group flex items-center gap-3 p-4 rounded-xl bg-card border border-border transition-all hover:border-blue-500/20',
                    isDragging && 'shadow-lg shadow-blue-500/10 z-50'
                )}
            >
                {/* Drag handle */}
                <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1 -ml-1 text-muted-foreground hover:text-foreground transition-colors">
                    <GripVertical className="w-4 h-4" />
                </button>

                {editing ? (
                    <div className="flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-2">
                        <input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="flex-1 px-3 py-1.5 rounded-lg bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            autoFocus
                        />
                        <select
                            value={editCategory}
                            onChange={(e) => setEditCategory(e.target.value as ComponentCategory)}
                            className="px-3 py-1.5 rounded-lg bg-secondary border border-border text-sm text-foreground focus:outline-none"
                        >
                            {CATEGORY_OPTIONS.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                        <input
                            type="number"
                            value={editPrice}
                            onChange={(e) => setEditPrice(e.target.value)}
                            className="w-24 px-3 py-1.5 rounded-lg bg-secondary border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        />
                        <div className="flex gap-1">
                            <button onClick={handleSave} className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors">
                                <Check className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => setEditing(false)} className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-sm font-medium text-foreground truncate">{component.name}</span>
                                <span className="text-[10px] text-muted-foreground bg-secondary px-2 py-0.5 rounded-md">{component.category}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">{formatCurrency(component.price)}</span>
                        </div>

                        {/* Status selector */}
                        <select
                            value={component.status}
                            onChange={(e) => handleStatusChange(e.target.value as ComponentStatus)}
                            className={cn(
                                'px-3 py-1.5 rounded-lg text-xs font-medium border-0 focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer',
                                STATUS_COLORS[component.status].bg,
                                STATUS_COLORS[component.status].text
                            )}
                        >
                            <option value="planned">Planned</option>
                            <option value="ordered">Ordered</option>
                            <option value="delivered">Delivered</option>
                            <option value="installed">Installed</option>
                        </select>

                        {/* Actions */}
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => { setEditName(component.name); setEditPrice(String(component.price)); setEditCategory(component.category); setEditing(true); }}
                                className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
                            >
                                <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                                onClick={() => setDeleteOpen(true)}
                                className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors text-muted-foreground hover:text-red-400"
                            >
                                <Trash2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </>
                )}
            </motion.div>

            <ConfirmDialog
                open={deleteOpen}
                onClose={() => setDeleteOpen(false)}
                onConfirm={() => deleteComponent(projectId, component.id)}
                title="Delete Component"
                description={`Are you sure you want to delete "${component.name}"?`}
                confirmLabel="Delete"
                variant="danger"
            />
        </>
    );
}

export function ProjectComponents({ project }: Props) {
    const addComponent = useProjectStore((s) => s.addComponent);
    const reorderComponents = useProjectStore((s) => s.reorderComponents);
    const [showAdd, setShowAdd] = useState(false);
    const [newName, setNewName] = useState('');
    const [newCategory, setNewCategory] = useState<ComponentCategory>('Other');
    const [newPrice, setNewPrice] = useState('');

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = project.components.findIndex((c) => c.id === active.id);
            const newIndex = project.components.findIndex((c) => c.id === over.id);
            reorderComponents(project.id, oldIndex, newIndex);
        }
    };

    const handleAdd = () => {
        if (!newName.trim()) return;
        addComponent(project.id, {
            name: newName.trim(),
            category: newCategory,
            price: Number(newPrice) || 0,
            status: 'planned'
        });
        setNewName('');
        setNewPrice('');
        setNewCategory('Other');
        setShowAdd(false);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Components ({project.components.length})
                </h3>
                <button
                    onClick={() => setShowAdd(true)}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors"
                >
                    <Plus className="w-3.5 h-3.5" />
                    Add Component
                </button>
            </div>

            {/* Add component form */}
            <AnimatePresence>
                {showAdd && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-4 rounded-xl bg-card border border-blue-500/20 space-y-3">
                            <div className="flex flex-col sm:flex-row gap-3">
                                <input
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    placeholder="Component name"
                                    className="flex-1 px-3 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                    autoFocus
                                />
                                <select
                                    value={newCategory}
                                    onChange={(e) => setNewCategory(e.target.value as ComponentCategory)}
                                    className="px-3 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground focus:outline-none"
                                >
                                    {CATEGORY_OPTIONS.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                                <input
                                    type="number"
                                    value={newPrice}
                                    onChange={(e) => setNewPrice(e.target.value)}
                                    placeholder="Price"
                                    className="w-28 px-3 py-2 rounded-lg bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                />
                            </div>
                            <div className="flex gap-2 justify-end">
                                <button
                                    onClick={() => setShowAdd(false)}
                                    className="px-3 py-1.5 rounded-lg bg-secondary hover:bg-accent text-sm text-foreground transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAdd}
                                    disabled={!newName.trim()}
                                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-medium transition-colors"
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Components list */}
            {project.components.length === 0 ? (
                <EmptyState
                    title="No components"
                    description="Add components to track your server build progress."
                    action={
                        <button
                            onClick={() => setShowAdd(true)}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-sm font-medium"
                        >
                            <Plus className="w-4 h-4" />
                            Add Component
                        </button>
                    }
                />
            ) : (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <SortableContext items={project.components.map((c) => c.id)} strategy={verticalListSortingStrategy}>
                        <div className="space-y-2">
                            <AnimatePresence mode="popLayout">
                                {project.components.map((component) => (
                                    <SortableItem key={component.id} component={component} projectId={project.id} />
                                ))}
                            </AnimatePresence>
                        </div>
                    </SortableContext>
                </DndContext>
            )}
        </div>
    );
}
