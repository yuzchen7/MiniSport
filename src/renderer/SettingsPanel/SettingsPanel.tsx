import './SettingsPanel.css';

import { IoCloseOutline, IoTrashOutline } from "react-icons/io5";

import FileIcon from '../FileIcon/FileIcon';
import { PathUtils } from '../utils/PathConverter';

interface Workspace {
    id: number;
    name: string;
    path: string;
}

interface Props {
    workspaces: Workspace[];
    onClose: () => void;
    onAddFolder: () => void;
    onRemoveFolder: (id: number) => void;
}

export default function SettingsPanel(props: Props) {
    function formatPathForOS(path: string) {
        return __PLATFORM__ === "win32"
            ? path.replaceAll("/", "\\")
            : path;
    }

    return (
        <div className="settings-panel">

            <div className="settings-header">
                <span>Workspaces</span>
                <IoCloseOutline className="close-btn" onClick={props.onClose} />
            </div>

            <div className="workspace-list">
                {props.workspaces.map(ws => (
                    <div key={ws.id} className="workspace-item">
                        <div className="workspace-name">
                            <FileIcon path={ws.path} size={30} />
                            <span style={{ fontSize: '14px' }}>
                                {PathUtils.formatPathForOS(PathUtils.smartPath(ws.path))}
                            </span>
                        </div>
                        <IoTrashOutline className="delete-btn" size={20} onClick={() => props.onRemoveFolder(ws.id)} />
                    </div>
                ))}
            </div>

            <button className="add-folder-btn" onClick={props.onAddFolder}>
                + Add Folder
            </button>
        </div>
    );
}