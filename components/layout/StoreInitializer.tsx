'use client';

import { useEffect } from 'react';
import { useProjectStore } from '@/store/useProjectStore';

export function StoreInitializer() {
    const initialize = useProjectStore((s) => s.initialize);

    useEffect(() => {
        initialize();
    }, [initialize]);

    return null;
}
