import { ipcMain, app } from "electron";
import logger from "../../share/utils/mainLogger";

export function registerAppExit() {
    ipcMain.handle("app-exit", async () => {
        logger.info("[App] Exit requested");
        return app.quit();
    });
}