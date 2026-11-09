import { dialog, ipcMain } from "electron";
import { runtimeState } from "../../runtime";
import { windowManager } from "../../WindowManager";
import logger from "../../../share/utils/mainLogger";

export function registerPickWorkspaceHandler() {
    ipcMain.handle("pick-workspace", async () => {
        logger.info("[Workspace] Folder picker opened");
        const mainWindow = windowManager.window;
        runtimeState.isPickingFolder = true;
        mainWindow?.setAlwaysOnTop(false);
        let result: any;
        try {
            result =
                await dialog.showOpenDialog(mainWindow!, {
                    properties: ["openDirectory"]
                });
            if (result.canceled) {
                return null;
            }
            return result.filePaths[0];
        } finally {
            mainWindow?.setAlwaysOnTop(true);
            runtimeState.isPickingFolder = false;
            logger.info(
                `[Workspace] Folder selected | path=${result?.filePaths[0] ?? "canceled"}`
            );
        }
    });
}