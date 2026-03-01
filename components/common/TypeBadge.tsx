'use client';

import { cn } from '@/lib/utils';
import type { ProjectType } from '@/lib/types';
import { PROJECT_TYPE_COLORS } from '@/lib/types';

interface TypeBadgeProps {
    type: ProjectType;
    className?: string;
}

export function TypeBadge({ type, className }: TypeBadgeProps) {
    return (
        <span
            className={cn(
                'inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold text-white bg-gradient-to-r shadow-sm',
                PROJECT_TYPE_COLORS[type],
                className
            )}
        >
            {type}
        </span>
    );
}
