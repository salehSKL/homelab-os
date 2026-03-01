'use client';

import { cn } from '@/lib/utils';
import type { ComponentStatus } from '@/lib/types';
import { STATUS_COLORS } from '@/lib/types';

interface StatusBadgeProps {
    status: ComponentStatus;
    className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
    const colors = STATUS_COLORS[status];
    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium capitalize',
                colors.bg,
                colors.text,
                className
            )}
        >
            <span className={cn('w-1.5 h-1.5 rounded-full', colors.dot)} />
            {status}
        </span>
    );
}
