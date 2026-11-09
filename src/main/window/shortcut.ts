import { app, globalShortcut } from "electron";
import { windowManager } from "../WindowManager";
import logger from "../../share/utils/mainLogger";

export function shortcut() {
    logger.info("[Shortcut] Registering global shortcuts");
    globalShortcut.register("CommandOrControl+Shift+Space", () => {
        windowManager.toggle();
    });

    globalShortcut.register("Alt+Shift+Space", () => {
        windowManager.toggle();
    });

    globalShortcut.register("CommandOrControl+Shift+Q", () => {
        app.quit();
    });

    globalShortcut.register("Escape", () => {
        windowManager.hide();
    });

    logger.info(
        `[Shortcut] Registration status | ` +
        `Ctrl+Shift+Space=${globalShortcut.isRegistered("CommandOrControl+Shift+Space")} ` +
        `Alt+Shift+Space=${globalShortcut.isRegistered("Alt+Shift+Space")} ` +
        `Ctrl+Shift+Q=${globalShortcut.isRegistered("CommandOrControl+Shift+Q")} ` +
        `Escape=${globalShortcut.isRegistered("Escape")}`
    );
   logger.info("[Shortcut] Global shortcuts registered done");
}