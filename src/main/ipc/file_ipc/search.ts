import { ipcMain } from "electron";
import { FileService } from "../../../services/FileService";
import logger from "../../../share/utils/mainLogger";

export function registerSearch(searchService: FileService) {
    ipcMain.handle("search", async (_, keyword: string) => {
        logger.info(`[Search] Search requested | keyword="${keyword}"`);
        return await searchService.search(keyword);
    });
}