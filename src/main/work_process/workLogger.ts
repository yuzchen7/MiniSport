import { createAppLogger } from "../../share/utils/LoggerFactory";
import path from "path";

const logDir =
    process.env.WORKER_LOG_DIR ??
    path.join(process.cwd(), "logs");

const logger = createAppLogger(
    logDir,
    "MiniSport"
);

export default logger;