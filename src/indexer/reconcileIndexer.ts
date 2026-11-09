import { FileRepository } from "../database/FileRepository";
import fs from "fs";
import path from "path";
import { FileItem } from "../share/type";
import logger from "../share/utils/mainLogger";

export async function reconcileIndex(folder: string, fileRepository: FileRepository): Promise<number> {
    let fileItem: FileItem[] = [];
    const stack: string[] = [folder];
    let totalCount: number = 0;
    
    logger.info(`[Reconcile] Scan started | workspace=${folder}`);

    const nowTime = Date.now();

    while(stack.length > 0) {
        const dir = stack.pop();
        if (!dir) continue;
        let files: fs.Dirent[];

        try {
            files = await fs.promises.readdir(dir, {
                withFileTypes: true
            });
        } catch (err) {
            logger.warn(`[Reconcile] Read directory failed | path=${dir}`);
            continue;
        }

        for (const f of files) {
            const fullPath = path.join(dir, f.name);
            fileItem.push({
                path: fullPath,
                name: f.name,
                parent_name: path.basename(dir),
                is_folder: f.isDirectory() ? 1 : 0,
                created_at: nowTime,
                updated_at: nowTime
            });
            if (f.isDirectory()) {
                stack.push(fullPath);
            }
        }

        if (fileItem.length >= 1000) {
            totalCount += fileItem.length;
            await fileRepository.insertBatch(fileItem);
            fileItem = [];
        }
    }

    if (fileItem.length !== 0) {
        totalCount += fileItem.length;
        await fileRepository.insertBatch(fileItem);
    }

    await fileRepository.removeUpdateNotAtInRootPath(folder, nowTime);

    logger.info(`[Reconcile] Scan completed | workspace=${folder} scanned=${totalCount}`);
    logger.info(`[Reconcile] Scheduler started | workspace=${folder} interval=60s`);
    
    return totalCount;
}