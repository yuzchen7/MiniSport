import { BrowserWindow, ipcMain } from "electron";

export function registerResizeWindow() {
    ipcMain.handle("resize-window", (event, height: number) => {
        const win = BrowserWindow.fromWebContents(event.sender);
        win?.setSize(
            650,
            height
        );
    });
}