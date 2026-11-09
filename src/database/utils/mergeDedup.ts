export function mergeDedup(a: any[], b: any[]) {
    const map = new Map<string, any>();

    for (const item of a) {
        map.set(item.path, item);
    }

    for (const item of b) {
        if (!map.has(item.path)) {
            map.set(item.path, item);
        }
    }

    return Array.from(map.values());
}