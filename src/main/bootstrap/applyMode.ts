import path from "path";
import { createIndexHandler } from "../../indexer/indexHandler";
import { startReconcileScheduler } from "../../indexer/scheduler";
import { watcherManager } from "../../indexer/WatcherManager";
import { FileService } from "../../services/FileService";
import logger from "../../share/utils/mainLogger";

export function applyMode(
    workspaceStats: {
        ws: string;
        dirCount: number;
        indexService: FileService;
    }[]
) {
    type Mode = "FULL_WATCHER" | "HYBRID" | "RECONCILE_ONLY";

    function chooseMode(dirCount: number): Mode {
        if (dirCount <= 5000) return "FULL_WATCHER";
        // if (dirCount <= 20000) return "HYBRID";
        return "RECONCILE_ONLY";
    }

    for (const { ws, dirCount, indexService } of workspaceStats) {
        const mode = chooseMode(dirCount < 5000 ? 5001 : dirCount);

        logger.info(`[Workspace] Mode selected | workspace=${ws} mode=${mode} dirs=${dirCount}`);

        const handleEvent = createIndexHandler(indexService.index);

        if (mode === "FULL_WATCHER") {
            watcherManager.createWatcher(ws, handleEvent);
        }

        if (mode === "RECONCILE_ONLY") {
            if (watcherManager.hasWatcher(ws)) {
                watcherManager.removeWatcher(ws);
            }
        }

        startReconcileScheduler(ws, indexService.index, 10 * 1000);
    }
}