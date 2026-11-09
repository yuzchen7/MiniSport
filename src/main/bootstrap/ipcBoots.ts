import { FileService } from "../../services/FileService";
import { WorkspacesService } from "../../services/WorkspacesService";
import ipc from "../ipc";
import logger from "../../share/utils/mainLogger";

export function setupIPC(dev: { fileService: FileService, workspacesService: WorkspacesService }) {
    ipc.registerSearch(dev.fileService);
    ipc.registerGetWorkspaces(dev.workspacesService);
    ipc.registerAddWorkspaces(dev.workspacesService);
    ipc.registerOpenPath(dev.fileService);
    ipc.registerAppExit();
    ipc.registerHideWindow();
    ipc.registerResizeWindow();
    ipc.registerPickWorkspaceHandler();
    ipc.registerRemoveWorkspaces(dev.workspacesService);
    ipc.registerGetFileIcon();
    ipc.registerOpenExternal();
    ipc.registerTheme();
    logger.info("[IPC] Initialized");
}