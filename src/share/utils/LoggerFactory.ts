import { createLogger, format, transports } from "winston";
import fs from "fs";
import path from "path";

export function createAppLogger(logDir: string, filename = "MiniSport") {
    const date = new Date().toISOString().split("T")[0];

    if (!logDir || logDir === "/") {
        throw new Error(`Invalid log directory: ${logDir}`);
    }

    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, {
            recursive: true
        });
    }

    return createLogger({
        level: "debug",

        format: format.combine(
            format.timestamp({
                format: "YYYY-MM-DD HH:mm:ss",
            }),
            format.printf(({ timestamp, level, message }) => {
                return `[${timestamp}] [${level}] ${message}`;
            })
        ),

        transports: [
            new transports.Console(),

            new transports.File({
                filename: path.join(
                    logDir,
                    `${filename}-${date}.log`
                ),
            }),
        ],
    });
}