import { registerOpenPath } from "./file_ipc/open-path";
import { registerAppExit } from "./app-exit";
import { registerHideWindow } from "./hideWindow";
import { registerSearch } from "./file_ipc/search";
import { registerResizeWindow } from './resize'
import { registerGetWorkspaces } from "./workspace_ipc/get-workspaces";
import { registerPickWorkspaceHandler } from "./workspace_ipc/pick-workspaces";
import { registerAddWorkspaces } from "./workspace_ipc/add-workspace";
import { registerRemoveWorkspaces } from "./workspace_ipc/remove-workspace"; 
import { registerGetFileIcon } from "./file_ipc/get-FileIcon";
import { registerOpenExternal } from "./external_ipc/open-External";
import { registerTheme } from "./registerTheme"

export default {
    registerOpenPath,
    registerAppExit,
    registerHideWindow,
    registerSearch,
    registerResizeWindow,
    registerPickWorkspaceHandler,
    registerAddWorkspaces,
    registerGetWorkspaces,
    registerRemoveWorkspaces,
    registerGetFileIcon,
    registerOpenExternal,
    registerTheme
}