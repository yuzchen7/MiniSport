import { ipcMain, nativeTheme, BrowserWindow } from "electron";

export function registerTheme() {
    ipcMain.handle("get-theme", async () => {
        return nativeTheme.shouldUseDarkColors;
    });

    nativeTheme.on("updated", () => {
        const isDark = nativeTheme.shouldUseDarkColors;
        BrowserWindow.getAllWindows().forEach((win) => {
            win.webContents.send("theme-changed", isDark);
        })
    });
}