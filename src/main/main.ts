import { app, globalShortcut } from "electron";

const gotProcessTheLock = app.requestSingleInstanceLock();

if (!gotProcessTheLock) {
    app.quit();
    process.exit(0);
}

const isMac = process.platform === "darwin";
const isWindows = process.platform === "win32";

if (isMac) {
    app.setActivationPolicy("accessory");
    app.dock?.hide();
}

import { windowManager } from "./WindowManager";
import { createWindow } from "./window/createWindow";
import { windowPosition } from "./window/windowPosition";
import { bootstrapIndexer } from "./bootstrap/bootstrapIndexer";
import { shortcut } from "./window/shortcut";
import { setupIPC } from "./bootstrap/ipcBoots";
import logger from "../share/utils/mainLogger";

const version = app.getVersion();
logger.info(`[App] Starting | version=${version}`);

let emfileShown = false;

process.on("unhandledRejection", (err: any) => {
    if (err?.code === "EMFILE") {
        if (!emfileShown) {
            emfileShown = true;
            logger.error(`[Watcher] EMFILE | file watch limit reached`);
        }
        return;
    }
    
    logger.error(`[Process] Unhandled promise rejection, ${err}`);
});

process.on("uncaughtException", (err) => {
    logger.error(
        `[Process] Uncaught exception | error=${err.message}`
    );
});

app.on("second-instance", () => {
    logger.info("[App] Second instance detected");
    const win = windowManager.window;

    if (!win) return;

    if (win.isMinimized()) {
        win.restore();
    }

    win.show();
    win.focus();
});

app.whenReady().then(async () => {
    const { fileService, workspacesService, start } = await bootstrapIndexer();
    setupIPC({ fileService, workspacesService });
    createWindow(isMac, isWindows);
    windowPosition();
    shortcut();
    start();
});

app.on("will-quit", () => {
    logger.info("[App] Shutting down");
    globalShortcut.unregisterAll();
});

windowManager.window?.once("ready-to-show", () => {
    const win = windowManager.window!;
    win.setMinimumSize(0, 57);
    win.setMaximumSize(Infinity, 57);
});

app.on("ready", () => {
     logger.info("[App] Startup complete");
});

app.on("before-quit", () => {
    logger.info("[App] Before Quit");
});

app.on("quit", () => {
    logger.info("[App] Exited");
});