import fs from "fs";
import path from "path";

const ROOT =
    "/Users/yuzchen/Desktop/MiniSport/stress-test";

const GROUPS = 50;
const DIRS_PER_GROUP = 1000;

fs.mkdirSync(ROOT, {
    recursive: true
});

let dirCount = 0;
let fileCount = 0;

for (let g = 1; g <= GROUPS; g++) {
    const groupDir = path.join(
        ROOT,
        `group_${String(g).padStart(4, "0")}`
    );

    fs.mkdirSync(groupDir, {
        recursive: true
    });

    for (let d = 1; d <= DIRS_PER_GROUP; d++) {
        const dir = path.join(
            groupDir,
            `dir_${String(d).padStart(6, "0")}`
        );

        fs.mkdirSync(dir);

        fs.writeFileSync(
            path.join(dir, "file.txt"),
            "x"
        );

        dirCount++;
        fileCount++;

        if (dirCount % 10000 === 0) {
            console.log(
                `dirs=${dirCount.toLocaleString()} files=${fileCount.toLocaleString()}`
            );
        }
    }
}

console.log("DONE");
console.log(
    `dirs=${dirCount.toLocaleString()}`
);
console.log(
    `files=${fileCount.toLocaleString()}`
);