import { ipcMain } from "electron";
import { WorkspacesService } from "../../../services/WorkspacesService";
import logger from "../../../share/utils/mainLogger";

export function registerRemoveWorkspaces(workspacesService: WorkspacesService) {
    ipcMain.handle("remove-workspaces", async (_, path: string) => {
        logger.info(`[Workspace] Removed | path=${path}`);
        return workspacesService.removeWorkspace(path);
    });
}