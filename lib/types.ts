export type ProjectType = 'ITX' | 'Rack' | 'NAS' | 'Custom';

export type ComponentStatus = 'planned' | 'ordered' | 'delivered' | 'installed';

export type ComponentCategory =
    | 'Case'
    | 'CPU'
    | 'Motherboard'
    | 'Cooler'
    | 'PSU'
    | 'RAM'
    | 'Storage'
    | 'Fan'
    | 'UPS'
    | 'GPU'
    | 'Networking'
    | 'Other';

export interface Component {
    id: string;
    name: string;
    category: ComponentCategory;
    price: number;
    status: ComponentStatus;
}

export interface Project {
    id: string;
    name: string;
    type: ProjectType;
    budget: number;
    createdAt: string;
    components: Component[];
}

export const STATUS_COLORS: Record<ComponentStatus, { bg: string; text: string; dot: string }> = {
    planned: { bg: 'bg-blue-500/10', text: 'text-blue-400', dot: 'bg-blue-400' },
    ordered: { bg: 'bg-amber-500/10', text: 'text-amber-400', dot: 'bg-amber-400' },
    delivered: { bg: 'bg-purple-500/10', text: 'text-purple-400', dot: 'bg-purple-400' },
    installed: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', dot: 'bg-emerald-400' },
};

export const PROJECT_TYPE_COLORS: Record<ProjectType, string> = {
    ITX: 'from-blue-500 to-cyan-500',
    Rack: 'from-purple-500 to-pink-500',
    NAS: 'from-emerald-500 to-teal-500',
    Custom: 'from-orange-500 to-amber-500',
};

export const CATEGORY_OPTIONS: ComponentCategory[] = [
    'Case', 'CPU', 'Motherboard', 'Cooler', 'PSU', 'RAM', 'Storage', 'Fan', 'UPS', 'GPU', 'Networking', 'Other',
];
