import { app } from "electron";
import path from "path";
import { createAppLogger } from "./LoggerFactory";

const isDev = process.env.LOCAL_TEST_DB === "true";

const logDir = isDev
    ? path.join(process.cwd(), "logs")
    : path.join(
        app.getPath("userData"),
        "logs"
    );

const logger = createAppLogger(
    logDir,
    "MiniSport"
);

export default logger;