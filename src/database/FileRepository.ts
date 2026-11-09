import p from "path";

import { Database } from "better-sqlite3";
import { sanitizeFtsQuery } from "./utils/SanitizeFtsQuery";
import { mergeDedup } from "./utils/mergeDedup";
import { FileItem } from "../share/type";

export class FileRepository {
    constructor(private db: Database) { }

    insert(item: FileItem) {
        item.path = p.normalize(item.path);

        const stmt = this.db.prepare(`
            INSERT OR IGNORE INTO items(
                name,
                path,
                parent_name,
                is_folder,
                created_at,
                updated_at
            )
            VALUES(
                @name,
                @path,
                @parent_name,
                @is_folder,
                @created_at,
                @updated_at
            )
        `);

        stmt.run(item);
    }

    search(keyword: string) {
        console.log("FileRepository search:", keyword);
        if (!keyword) return [];

        const tokens = sanitizeFtsQuery(keyword)
            .split(" ")
            .filter(Boolean)
            .map(w => w + "*");

        const wordQuery = tokens.length
            ? tokens.join(" AND ")
            : "";

        let fts_results: any[] = [];

        console.log("FTS query:", wordQuery);

        if (wordQuery) {
            fts_results = this.db.prepare(`
                SELECT i.*
                FROM items_fts f
                JOIN items i ON i.rowid = f.rowid
                WHERE items_fts MATCH ?
                ORDER BY bm25(items_fts) - (log(usage_count + 1) * 0.5), i.is_folder DESC
                limit 100
            `).all(wordQuery);

            console.log("FTS results:", fts_results.length);
        }

        const name_results = this.db.prepare(`
            SELECT *
            FROM items
            WHERE LOWER(name) LIKE LOWER(?)
            ORDER BY items.usage_count DESC, items.is_folder DESC
            limit 100
        `).all(`%${keyword}%`);

        const path_results = this.db.prepare(`
            SELECT *
            FROM items
            WHERE LOWER(path) LIKE LOWER(?)
            ORDER BY items.usage_count DESC, items.is_folder DESC
            limit 100
        `).all(`%${keyword}%`);

        return mergeDedup(name_results, fts_results.concat(path_results));
    }

    removeByPath(path: string) {
        path = p.normalize(path);

        return this.db.prepare(`
            DELETE FROM items WHERE path = ?
        `).run(path);
    }

    removeUpdateNotAt(time: number) {
        return this.db.prepare(`
            DELETE FROM items WHERE updated_at != ?
        `).run(time).changes;
    }

    removeUpdateNotAtInRootPath(rootPath: string, time: number) {
        return this.db.prepare(`
            DELETE FROM items
            WHERE updated_at != ?
            AND (path = ? OR path LIKE ?)
        `).run(
            time,
            rootPath,
            `${rootPath}/%`
        ).changes;
    }

    removeByRootPath(rootPath: string) {
        rootPath = p.normalize(rootPath);

        return this.db.prepare(`
            DELETE FROM items
            WHERE path LIKE ?
        `).run(`${rootPath}%`);
    }

    update(file: { path: string; updated_at: number }) {
        file.path = p.normalize(file.path);

        return this.db.prepare(`
            UPDATE items
            SET updated_at = @updated_at
            WHERE path = @path
        `).run(file);
    }

    getAll() {
        return this.db.prepare(`SELECT * FROM items`).all();
    }

    getAllPaths(): string[] {
        return this.db.prepare(`SELECT path FROM items`).all().map((r: any) => r.path);
    }

    has(path: string): boolean {
        path = p.normalize(path);

        return !!this.db.prepare(`
            SELECT 1 FROM items WHERE path = ? LIMIT 1
        `).get(path);
    }

    insertFromPath(file: FileItem) {
        this.insert({
            ...file,
            updated_at: Date.now()
        });
    }

    insertBatch(fileItems: FileItem[]) {
        if (fileItems.length === 0) return;
        const CHUNK_SIZE = 100;

        let items_count = 0;

        const trx = this.db.transaction((fileItemChunk: FileItem[]) => {
            const placeholders = fileItemChunk.map(() => "(?, ?, ?, ?, ?, ?)").join(",");
            const stmt = this.db.prepare(`
                INSERT INTO items (
                    path,
                    name,
                    parent_name,
                    is_folder,
                    created_at,
                    updated_at
                )
                VALUES ${placeholders}
                ON CONFLICT(path) DO Update Set
                    updated_at = excluded.updated_at
            `);

            const flatArray = fileItemChunk.flatMap((r) => {
                return [r.path, r.name, r.parent_name, r.is_folder, r.created_at, r.updated_at];
            });

            const result = stmt.run(flatArray);
            items_count += result.changes;
        });

        for (let i = 0; i < fileItems.length; i += CHUNK_SIZE) {
            trx(fileItems.slice(i, i + CHUNK_SIZE));
        }

        return items_count;
    }

    incrementFileUsageCount(path: string) {
        const result = this.db.prepare(`
            UPDATE items
            SET usage_count = usage_count + 1
            WHERE path = ?
        `).run(path);

        return result.changes > 0;
    }
}