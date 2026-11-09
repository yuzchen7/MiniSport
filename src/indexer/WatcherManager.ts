import chokidar, { FSWatcher } from "chokidar";
import logger from "../share/utils/mainLogger";
import path from "path";

class WatcherManager {
    constructor(
        private watchersMap: Map<string, FSWatcher> = new Map<string, FSWatcher>()
    ) {}

    createWatcher(folder: string, onEvent: (event: any) => void) {
        if (this.watchersMap.has(folder)) {
            return this.watchersMap.get(folder);
        }
        const watcher = this.createWatcherRun(folder, onEvent);
        this.watchersMap.set(folder, watcher);
        return watcher;
    }

    hasWatcher(ws: string) {
        return this.watchersMap.has(ws);
    }

    getWatcher(ws: string) {
        return this.watchersMap.get(ws);
    }

    removeWatcher(ws: string) {
        if (this.watchersMap.has(ws)) {
            const watcher = this.watchersMap.get(ws);
            watcher!.close();
            this.watchersMap.delete(ws);
            logger.info(`[Watcher] Stopped | workspace=${ws}`);
        }
    }

    private createWatcherRun(folder: string, onEvent: (event: any) => void) {
        logger.info(`[Watcher] Started | workspace=${folder}`);

        const watcher = chokidar.watch(folder, {
            ignoreInitial: true,
            persistent: true
        });

        const safeEmit = (event: any, p: string) => {
            if (!p || typeof p !== "string") return;

            onEvent({
                type: event,
                path: p
            });
        };

        watcher.on("add", (p: any) => {
            safeEmit("add", p);
        });

        watcher.on("unlink", (p: any) => {
            safeEmit("unlink", p);
        });

        watcher.on("change", (p: any) => {
            safeEmit("change", p);
        });

        return watcher;
    }
}

export const watcherManager = new WatcherManager();