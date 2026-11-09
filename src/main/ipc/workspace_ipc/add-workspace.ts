import { ipcMain } from "electron";
import { WorkspacesService } from "../../../services/WorkspacesService";
import logger from "../../../share/utils/mainLogger";

export function registerAddWorkspaces(workspacesService: WorkspacesService) {
    ipcMain.handle("add-workspaces", (_, path: string) => {
        logger.info(`[Workspace] Added | path=${path}`);
        return workspacesService.addWorkspace(path);
    });
}