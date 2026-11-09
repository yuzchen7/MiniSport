import { fork } from "child_process";
import path from "path";
import { FileService } from "../../services/FileService";
import { applyMode } from "../bootstrap/applyMode";
import { IndexMode } from "../../share/type";
import logger from "../../share/utils/mainLogger";
import { app } from "electron";

const logDir = path.join(app.getPath("userData"), "logs");

export function startIndexer(workspaces: string[], fileService: FileService, mode: IndexMode = IndexMode.RELOAD) {
    logger.info(`[Indexer] Started | mode=${IndexMode[mode]} workspaces=${workspaces.length}`);
    const worker = fork(path.join(__dirname, "./indexer-worker.js"), [], {
        env: {
            ...process.env,
            WORKER_LOG_DIR: logDir
        }
    });

    const scan_time = Date.now();

    worker.send({
        type: "start",
        workspaces,
        scan_time
    });

    const workspaceCount = new Map<string, number>();
    let count_total = 0;
    let queue = Promise.resolve();

    worker.on("message", async (msg: any) => {
        if (msg.type === "batch") {
            if (!workspaceCount.has(msg.workspace)) {
                workspaceCount.set(msg.workspace, msg.data.length);
            } else {
                workspaceCount.set(msg.workspace, workspaceCount.get(msg.workspace)! + msg.data.length);
            }
            queue = queue.then(async () => {
                const inserted = await fileService.insertBatch(msg.data);
                count_total += inserted ?? 0;
            });
        }

        if (msg.type === "done") {
            queue.then(() => {
                logger.info(`[Indexer] Initial scan completed | indexed=${count_total}`);
                if (mode === IndexMode.RELOAD) {
                    const removedCount = fileService.removeUpdateNotAt(scan_time);
                    logger.info(`[Indexer] Cleanup completed | removed=${removedCount}`);
                }
                applyMode(Array.from(workspaceCount.entries()).map(([ws, dirCount]) => ({
                    ws,
                    dirCount,
                    indexService: fileService
                })));
            });
        }
    });
    
    worker.on("exit", (code, signal) => {
        logger.info(`[Worker] Exited | code=${code} signal=${signal ?? "none"}`);
    });

    worker.on("error", (err) => {
        logger.error(`[Indexer] worker error: ${err.stack}`);
    });

    return worker;
}