import { Database } from "better-sqlite3";

export function initializeDatabase(db: Database) {
    db.exec(`
        CREATE TABLE IF NOT EXISTS items (
            rowid INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            path TEXT NOT NULL UNIQUE,
            parent_name TEXT,
            is_folder INTEGER DEFAULT 0,
            usage_count INTEGER DEFAULT 0,
            created_at INTEGER NOT NULL,
            updated_at INTEGER NOT NULL
        );
    `);

    db.exec(`
        CREATE VIRTUAL TABLE IF NOT EXISTS items_fts
        USING fts5(
            name,
            parent_name,
            content='items',
            content_rowid='rowid'
        );
    `);

    db.exec(`
        CREATE TRIGGER IF NOT EXISTS items_ai AFTER INSERT ON items BEGIN
            INSERT INTO items_fts(rowid, name, parent_name)
            VALUES (new.rowid, new.name, new.parent_name);
        END;
    `);

    db.exec(`
        CREATE TRIGGER IF NOT EXISTS items_ad AFTER DELETE ON items BEGIN
            INSERT INTO items_fts(items_fts, rowid, name, parent_name)
            VALUES('delete', old.rowid, old.name, old.parent_name);
        END;
    `);

    db.exec(`
        CREATE TRIGGER IF NOT EXISTS items_au AFTER UPDATE ON items BEGIN
            INSERT INTO items_fts(items_fts, rowid, name, parent_name)
            VALUES('delete', old.rowid, old.name, old.parent_name);

            INSERT INTO items_fts(rowid, name, parent_name)
            VALUES (new.rowid, new.name, new.parent_name);
        END;
    `);

    db.exec(`
        CREATE TABLE IF NOT EXISTS workspace (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            path TEXT UNIQUE NOT NULL,
            created_at INTEGER
        );
    `);
}