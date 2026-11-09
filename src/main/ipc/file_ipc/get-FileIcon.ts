import { app, ipcMain } from "electron";
import logger from "../../../share/utils/mainLogger";

export function registerGetFileIcon() {
    ipcMain.handle("get-file-icon", async (_, filePath: string) => {
        try {
            const icon = await app.getFileIcon(filePath, {
                size: "normal"
            });

            return icon.toDataURL();
        } catch (err: any) {
            logger.error(
                `[FileIcon] Failed | path=${filePath} error=${err.message}`,
                err
            );
            return null;
        }
    });
}