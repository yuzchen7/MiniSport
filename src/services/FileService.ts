import { FileRepository } from "../database/FileRepository";
import { FileItem } from "../share/type";

export class FileService {
    constructor(
        private fileIndex: FileRepository,
    ) {}

    async search(keyword: string) {
        const resultsArrays = this.fileIndex.search(keyword)
        return resultsArrays.flat();
    }

    async insertBatch(batch: FileItem[]) {
        return await this.fileIndex.insertBatch(batch);
    }

    get index() {
        return this.fileIndex;
    }

    removeUpdateNotAt(time: number) {
        return this.fileIndex.removeUpdateNotAt(time);
    }

    incrementFileUsageCount(path: string) {
        return this.fileIndex.incrementFileUsageCount(path);
    }
}