import { contextBridge, ipcRenderer } from "electron";

console.log("Preload script initialized.");

contextBridge.exposeInMainWorld("api", {
    search: (keyword: string) => ipcRenderer.invoke("search", keyword),
    openPath: (filePath: string) => ipcRenderer.invoke("open-path", filePath),
    appExit: () => ipcRenderer.invoke("app-exit"),
    onStartFade: (cb: () => void) => ipcRenderer.on("start-fade", cb),
    hideWindow: () => ipcRenderer.send("hide-window"),
    resizeWindow: (height: number) => ipcRenderer.invoke("resize-window", height),
    getWorkspaces: () => ipcRenderer.invoke("get-workspaces"),
    pickFolder: () => ipcRenderer.invoke("pick-workspace"),
    addWorkspace: (path: string) => ipcRenderer.invoke("add-workspaces", path),
    removeWorkspace: (path: string) => ipcRenderer.invoke("remove-workspaces", path),
    onWindowShow: (callback: () => void) => {
        const listener = () => callback();
        ipcRenderer.on("window-show", listener);
        return () => {
            ipcRenderer.removeListener("window-show", listener);
        };
    },
    getFileIcon: (filePath: string) => ipcRenderer.invoke("get-file-icon", filePath),
    openExternal: (url: string) => ipcRenderer.invoke("open-external", url),
    getTheme: () => ipcRenderer.invoke("get-theme"),
    onThemeChanged: (callback: (dark: boolean) => void)=> {
        const listener = (_: Electron.IpcRendererEvent, dark: boolean) => {
            callback(dark);
        };
        ipcRenderer.on("theme-changed", listener);
        return () => {
            ipcRenderer.removeListener("theme-changed", listener)
        }
    }
});