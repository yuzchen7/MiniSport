import { BrowserWindow, ipcMain, shell } from "electron";
import fs from "fs";
import logger from "../../../share/utils/mainLogger";
import { FileService } from "../../../services/FileService";

export function registerOpenPath(fileService: FileService) {
    ipcMain.handle("open-path", async (_event, filePath: string) => {
        logger.info(`[OpenPath] Open | path=${filePath}`);
        const win = BrowserWindow.fromWebContents(_event.sender);
        if (win) {
            win.hide();
        }
        try {
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
                await shell.openPath(filePath);
            } else {
                shell.showItemInFolder(filePath);
            }

            const updated = fileService.incrementFileUsageCount(filePath);

            if (!updated) {
                logger.warn(`[Usage] File not found | path=${filePath}`);
            }
            
        } catch (err: any) {
            logger.error(`[OpenPath] Failed | path=${filePath}`, err);
            throw err;
        }
    });
}