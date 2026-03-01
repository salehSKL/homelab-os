'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmLabel?: string;
    variant?: 'danger' | 'default';
}

export function ConfirmDialog({
    open,
    onClose,
    onConfirm,
    title,
    description,
    confirmLabel = 'Confirm',
    variant = 'default',
}: ConfirmDialogProps) {
    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ type: 'spring', bounce: 0.1, duration: 0.3 }}
                        className="fixed inset-0 flex items-center justify-center z-50 p-4"
                    >
                        <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    {variant === 'danger' && (
                                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-red-500/10">
                                            <AlertTriangle className="w-5 h-5 text-red-400" />
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="text-base font-semibold text-foreground">{title}</h3>
                                        <p className="text-sm text-muted-foreground mt-1">{description}</p>
                                    </div>
                                </div>
                                <button onClick={onClose} className="p-1 rounded-lg hover:bg-secondary transition-colors">
                                    <X className="w-4 h-4 text-muted-foreground" />
                                </button>
                            </div>
                            <div className="flex gap-3 justify-end mt-6">
                                <button
                                    onClick={onClose}
                                    className="px-4 py-2 text-sm font-medium rounded-lg bg-secondary hover:bg-accent transition-colors text-foreground"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => { onConfirm(); onClose(); }}
                                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors text-white ${variant === 'danger'
                                            ? 'bg-red-600 hover:bg-red-700'
                                            : 'bg-blue-600 hover:bg-blue-700'
                                        }`}
                                >
                                    {confirmLabel}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
