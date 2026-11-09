export {};

declare global {
    interface Window {
        api: {
            search: (keyword: string) => Promise<any[]>;
            openPath: (filePath: string) => Promise<void>;
            appExit: () => Promise<void>;
            onStartFade: (cb: () => void) => void;
            hideWindow: () => Promise<void>;
            resizeWindow: (height: number) => Promise<void>;
            getWorkspaces: () => Promise<any[]>;
            pickFolder: () => Promise<string | null>;
            addWorkspace: (path: string) => Promise<any[]>;
            removeWorkspace: (path: string) => Promise<any[]>;
            onWindowShow: (callback: () => void) => void;
            getFileIcon: (filePath: string) => Promise<string | null>;
            openExternal: (url: string) => Promise<void>;
            getTheme: () => Promise<boolean>;
            onThemeChanged: (callback: (dark: boolean) => void) => void;
        };
    }
}

declare const __PLATFORM__: "win32" | "darwin" | "linux";