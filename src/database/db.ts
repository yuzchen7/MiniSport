import Database from "better-sqlite3";
import { app } from "electron";
import path from "path";

const isLocalTest = process.env.LOCAL_TEST_DB === "true" ? true : false;

const dbPath = path.join(
    app.getPath("userData"),
    "data.db"
);

const db = new Database(isLocalTest ? 'indexedDB.db' :  dbPath);
db.pragma("journal_mode = WAL");
db.pragma("synchronous = NORMAL");

export { db };