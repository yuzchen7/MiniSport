export interface FileItem {
    name: string;
    path: string;
    parent_name: string;
    is_folder: number;
    created_at: number;
    updated_at: number;
}

export enum IndexMode {
    RELOAD = 0,
    NEW_PATH_ADD = 1,
}