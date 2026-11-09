export class PathUtils {
    static shortenName(name: string) {
        return name.length <= 20
            ? name
            : name.slice(-20);
    }

    static smartPath(path: string) {
        const parts = path.split(/[/\\]+/);
        const compressed = parts.map(PathUtils.shortenName);

        if (compressed.length <= 3) {
            return compressed.join("/");
        }

        return `${compressed[0]}/.../${compressed.at(-3)}/${compressed.at(-2)}/${parts.at(-1)}`;
    }

    static formatPathForOS(path: string) {
        return __PLATFORM__ === "win32"
            ? path.replaceAll("/", "\\")
            : path;
    }
}