import { db } from '../database/db';
import { WorkspacesPath, WorkspacesRepository } from '../database/WorkspacesRepository'
import { startIndexer } from '../main/work_process/startIndexer';
import { IndexMode } from '../share/type';
import { FileService } from './FileService';
import logger from "../share/utils/mainLogger";

export class WorkspacesService {
    constructor(
        private wsRepo: WorkspacesRepository,
        private fileService: FileService
    ) {}

    addWorkspace(workspace: string): WorkspacesPath[] {
        const current_path = this.wsRepo.getAll();
        let isNewPath = true;
        current_path.forEach((item) => {
            if (item.path === workspace) {
                isNewPath = false;
                return;
            }
        });
        
        if (isNewPath) {
            this.wsRepo.add(workspace);
            startIndexer([workspace], this.fileService, IndexMode.NEW_PATH_ADD);
            logger.info(`[Workspace] Added | path=${workspace}`);
        } else {
            logger.info(`[Workspace] Already exists | path=${workspace}`);
        }

        return this.wsRepo.getAll();
    }

    removeWorkspace(workspace: string): WorkspacesPath[] {
        const current_path = this.wsRepo.getAll();
        if (!workspace) {
            logger.warn("[Workspace] Remove failed | reason=empty path");
            return current_path;
        }

        if (current_path.some((item) => item.path === workspace)) {
            const tx = db.transaction(() => {
                this.wsRepo.remove(workspace);
                this.fileService.index.removeByRootPath(workspace);
                this.fileService.index.removeByPath(workspace);
            });
            tx();
            logger.info(`[Workspace] Removed | path=${workspace}`);
        } else {
            logger.warn(`[Workspace] Remove failed | path=${workspace} reason=not found`);
        }

        return this.wsRepo.getAll();
    }

    getAllWorkspace(): WorkspacesPath[] {
        return this.wsRepo.getAll();
    }

}