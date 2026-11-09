import { ipcMain } from "electron";
import { WorkspacesService } from "../../../services/WorkspacesService";

export function registerGetWorkspaces(getWorkspacesService: WorkspacesService) {
    ipcMain.handle("get-workspaces", () => {
        const workspaces = getWorkspacesService.getAllWorkspace();
        return workspaces;
    });
}