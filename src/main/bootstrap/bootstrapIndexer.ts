import { db } from "../../database/db";
import { FileRepository } from "../../database/FileRepository";
import { initializeDatabase } from "../../database/schema"
import { WorkspacesRepository } from "../../database/WorkspacesRepository";
import { FileService } from "../../services/FileService";
import { WorkspacesService } from "../../services/WorkspacesService";
import { startIndexer } from "../work_process/startIndexer";
import logger from "../../share/utils/mainLogger";

export async function bootstrapIndexer() {
    const startTime = performance.now();

    try {
        initializeDatabase(db);
    } catch (err) {
        logger.error("[Database] Initialization failed", err);
        throw err;
    }
    
    const workspacesRepository = new WorkspacesRepository(db);
    const workspaces = workspacesRepository.getAll().map((ws: any) => ws.path);

    const fileRepository = new FileRepository(db);
    const fileService = new FileService(fileRepository); // ⚠️如果你还没改可先留
    const workspacesService = new WorkspacesService(workspacesRepository, fileService);

    const start = () => { startIndexer(workspaces, fileService); }

    logger.info(`[Indexer] Initialized | workspaces=${workspaces.length} duration=${Math.round(performance.now() - startTime)}ms`);

    return {
        fileService,
        workspacesService,
        start
    };
}