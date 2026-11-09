import { BrowserWindow } from "electron";
import logger from "../../share/utils/mainLogger";

export function emitWindowShow(win: BrowserWindow) {
    win.webContents.send("window-show");
}