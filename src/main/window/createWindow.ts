import path from "path";
import { windowManager } from "../WindowManager";
import { BrowserWindow } from "electron";

const isLocalTest = process.env.LOCAL_TEST_DB === "true" ? true : false;

export function createWindow(isMac: boolean, isWindows: boolean) {
    const mainWindow = new BrowserWindow({
        width: 650,
        height: 57,
        frame: false,
        alwaysOnTop: true,
        transparent: isMac,

        // macOS
        vibrancy: isMac ? "hud" : undefined,
        visualEffectState: isMac ? "active" : undefined,

        // Windows
        backgroundMaterial: isWindows ? "mica" : undefined,
        titleBarStyle: isWindows ? "hidden" : undefined,
        
        show: false,
        resizable: isWindows,

        // resizable: true,

        skipTaskbar: true,
        webPreferences: {
            preload: path.join(__dirname, "../../preload/preload.js"),
            contextIsolation: true
        }
    });

    if (process.env.VITE_DEV_SERVER_URL) {
        // console.log("Loading dev server URL:");
        mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL)
    } else {
        // console.log("Loading dist/renderer/index.html");
        mainWindow.loadFile("dist/renderer/index.html")
    }

    mainWindow.on("blur", () => {
        if (windowManager.getIsHiding()) return;

        setTimeout(() => {
            if (!mainWindow?.webContents.isFocused()) {
                windowManager.hide();
            }
        }, 80);
    });

    if (isLocalTest) {
        mainWindow.webContents.openDevTools();
    }
    windowManager.setWindow(mainWindow);
}