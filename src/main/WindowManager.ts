import { BrowserWindow } from "electron";

class WindowManager {
    private mainWindow: BrowserWindow | null = null;
    private isHiding = false;

    setWindow(win: BrowserWindow) {
        this.mainWindow = win;
    }

    get window() {
        return this.mainWindow;
    }

    get hiding() {
        return this.isHiding;
    }

    show() {
        if (!this.mainWindow) return;

        this.isHiding = false;

        if (!this.mainWindow.isVisible()) {
            this.mainWindow.show();
        }

        this.mainWindow.focus();
        this.mainWindow.webContents.focus();
    }

    hide() {
        if (!this.mainWindow) return;

        this.isHiding = true;
        this.mainWindow.hide();
    }

    toggle() {
        if (!this.mainWindow) return;

        if (this.mainWindow.isVisible()) {
            this.hide();
        } else {
            this.show();
        }
    }

    getIsHiding() {
        return this.isHiding;
    }
}

export const windowManager = new WindowManager();