import { ipcMain, shell } from "electron";

export function registerOpenExternal() {
    ipcMain.handle("open-external", async (_, url: string) => {
        await shell.openExternal(url);
    });
}