import { Database } from "better-sqlite3";
import  p from 'path';

export interface WorkspacesPath {
    id: number;
    path: string;
    created_at: number;
}

export class WorkspacesRepository {
    constructor(private db: Database) {}

    add(path: string) {
        path = p.normalize(path);
        this.db.prepare(`
            INSERT OR IGNORE INTO workspace (path, created_at)
            VALUES (?, ?)
        `).run(path, Date.now());
    }

    getAll(): WorkspacesPath[] {
        return this.db.prepare(`
            SELECT * FROM workspace
        `).all() as WorkspacesPath[];
    }

    remove(path: string) {
        path = p.normalize(path);
        this.db.prepare(`
            DELETE FROM workspace WHERE path = ?
        `).run(path);
    }
}