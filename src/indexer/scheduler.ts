import { powerMonitor } from "electron";
import { reconcileIndex } from "./reconcileIndexer";
import { FileRepository } from "../database/FileRepository";
import path from "path";
import logger from "../share/utils/mainLogger";

let timers = new Map<string, NodeJS.Timeout>();
const running = new Set<string>();

export function startReconcileScheduler(folder: string, fileRepository: FileRepository, intervalMinutes: number = 10 * 60 * 1000) {
    stopReconcileScheduler(folder);

    const timer = setInterval(() => {
        const idleTime = powerMonitor.getSystemIdleTime();
        if (idleTime < 2 * 60) return;

        runSafe(folder, fileRepository);
    }, intervalMinutes);

    logger.info(`[Reconcile] Scheduler started | workspace=${folder} check_interval=${intervalMinutes / 1000}s idle_threshold=120s`);

    timers.set(folder, timer);
}

async function runSafe(folder: string, fileRepository: FileRepository) {
    if (running.has(folder)) return;
    running.add(folder);
    
    try {
        logger.info(`[Reconcile] Sync started | workspace=${folder}`);

        await reconcileIndex(folder, fileRepository);

    } catch (e: any) {
        logger.error(`[Reconcile] Failed | workspace=${folder} error=${e}`);
    } finally {
        running.delete(folder);
    }
}

export function stopReconcileScheduler(folder: string) {
    const t = timers.get(folder);
    if (t) clearInterval(t);
    timers.delete(folder);
}