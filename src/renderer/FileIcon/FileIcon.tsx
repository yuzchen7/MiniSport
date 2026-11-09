import { useEffect, useState } from "react";

interface Props {
    path: string;
    size?: number;
}

const iconCache = new Map<string, string>();
const iconLoadingCache = new Map<string, Promise<string | null>>();

function getCacheKey(path: string): string {
    const name = path.split(/[\\/]/).pop() ?? "";

    if (!name.includes(".")) {
        return "__no_extension__";
    }

    const ext = name.split(".").pop()?.toLowerCase();

    return ext || "__no_extension__";
}

export default function FileIcon({ path, size = 30 }: Props) {
    const [icon, setIcon] = useState("");

    useEffect(() => {
        const cacheKey = getCacheKey(path);
        const cachedIcon = iconCache.get(cacheKey);

        if (cachedIcon) {
            setIcon(cachedIcon);
            return;
        }

        let loadingPromise: Promise<string | null> | undefined = iconLoadingCache.get(cacheKey);

        if (!loadingPromise) {
            loadingPromise = window.api.getFileIcon(path);
            iconLoadingCache.set(cacheKey, loadingPromise!);
        }

        let cancelled = false;

        loadingPromise!.then((data) => {
            if (data) {
                iconCache.set(cacheKey, data);

                if (!cancelled) {
                    setIcon(data);
                }
            }
            iconLoadingCache.delete(cacheKey);
        }).finally(() => {
            iconLoadingCache.delete(cacheKey);
        });

        return () => {
            cancelled = true;
        };
    }, [path]);

    return (
        <img
            src={icon}
            width={size}
            height={size}
            draggable={false}
            alt=""
        />
    );
}