import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { v4 as uuidv4 } from 'uuid';
import type { Component, Project, ComponentStatus } from './types';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function generateId(): string {
    return uuidv4();
}

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

export function calculateProgress(components: Component[]): number {
    if (components.length === 0) return 0;
    const installed = components.filter((c) => c.status === 'installed').length;
    return Math.round((installed / components.length) * 100);
}

export function calculateTotalSpent(components: Component[]): number {
    return components
        .filter((c) => c.status === 'ordered' || c.status === 'delivered' || c.status === 'installed')
        .reduce((sum, c) => sum + c.price, 0);
}

export function calculateTotalCost(components: Component[]): number {
    return components.reduce((sum, c) => sum + c.price, 0);
}

export function getStatusCounts(components: Component[]): Record<ComponentStatus, number> {
    return {
        planned: components.filter((c) => c.status === 'planned').length,
        ordered: components.filter((c) => c.status === 'ordered').length,
        delivered: components.filter((c) => c.status === 'delivered').length,
        installed: components.filter((c) => c.status === 'installed').length,
    };
}

export function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}
