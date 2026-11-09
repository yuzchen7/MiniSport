import { FileRepository } from "../database/FileRepository";
import fs from "fs";
import path from "path";
import logger from "../share/utils/mainLogger";

export function createIndexHandler(fileIndex: FileRepository) {
    return async function handleEvent(event: any) {
        if (!event || typeof event.path !== "string") {
            logger.warn(`[Indexer] Invalid file system event ${event}`);
            return;
        }

        const fullPath = event.path;

        switch (event.type) {
            case "add":
            case "addDir": {
                try {
                    const stat = await fs.promises.stat(fullPath);

                    fileIndex.insert({
                        path: fullPath,
                        name: path.basename(fullPath),
                        parent_name: path.basename(path.dirname(fullPath)),
                        is_folder: stat.isDirectory() ? 1 : 0,
                        created_at: Date.now(),
                        updated_at: Date.now()
                    });
                } catch (e) {
                    logger.error(`[Indexer] Failed to index | path=${fullPath} | error=${e}`);
                }
                break;
            }

            case "unlink":
                fileIndex.removeByPath(fullPath);
                break;

            case "unlinkDir":
                fileIndex.removeByRootPath(fullPath);
                fileIndex.removeByPath(fullPath);
                break;

            case "change": {
                fileIndex.update({
                    path: fullPath,
                    updated_at: Date.now()
                });
                break;
            }
        }
    };
}