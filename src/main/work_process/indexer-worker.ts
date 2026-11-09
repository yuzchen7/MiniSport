import fs from "fs/promises";
import fsa from "fs";
import path from "path";
import { FileItem } from "../../share/type";
import logger from "./workLogger";

const BATCH_SIZE = 1000;

process.on("uncaughtException", (err: any) => {
    logger.error(`[Worker] Uncaught exception ${err.stack || err.message}`);
});

process.on("unhandledRejection", (err: any) => {
    logger.error(`[Worker] Unhandled promise rejection ${err.stack || err.message}`);
});

process.on("message", async (msg: any) => {
    if (msg.type === "start") {
        const workspaces: string[] = msg.workspaces;
        const nowTime: number = msg.scan_time

        for (const ws of workspaces) {
            logger.info(`[Worker] Scan started | workspace=${ws}`);
            await scan(ws, ws, nowTime);
        }

        logger.info("[Worker] Scan completed");
        process.send?.(
            { type: "done" },
            () => {
                (process as any).disconnect();
            }
        );
    }
});

async function scan(root: string, workspace: string, scanTime: number) {
    const stack: string[] = [root];
    let batch: FileItem[] = [];

    while (stack.length) {
        const dir = stack.pop();
        if (!dir) continue;

        let entries;
        try {
            entries = await fs.readdir(dir, { withFileTypes: true });
        } catch {
            continue;
        }

        for (const e of entries) {
            const fullPath = path.join(dir, e.name);

            batch.push({
                name: e.name,
                path: fullPath,
                parent_name: path.basename(dir),
                is_folder: e.isDirectory() ? 1 : 0,
                created_at: scanTime,
                updated_at: scanTime
            });

            if (e.isDirectory()) {
                stack.push(fullPath);
            }

            if (batch.length >= BATCH_SIZE) {
                process.send?.({
                    type: "batch",
                    workspace,
                    data: batch
                });

                batch = [];
                await yieldThread();
            }
        }
    }

    if (batch.length) {
        await send({
            type: "batch",
            workspace,
            data: batch,
            fileCount: batch.length
        });
    }
}

function yieldThread() {
    return new Promise(r => setImmediate(r));
}

function send(message: any): Promise<void> {
    return new Promise((resolve, reject) => {
        process.send?.(message, (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
}