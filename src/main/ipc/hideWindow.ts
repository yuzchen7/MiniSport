import { ipcMain } from "electron";
import { windowManager } from "../WindowManager";
import logger from "../../share/utils/mainLogger";

export function registerHideWindow() {
    ipcMain.handle("hide-window", () => {
        logger.info("[Window] Hide");
        windowManager.hide();
    });
}