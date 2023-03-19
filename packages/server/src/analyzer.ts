import * as process from "process";
import * as fs from "fs";
import path from "path";

const readFromDirectory = async (dirPath: string): Promise<string[]> => {
    return new Promise((resolve, reject) => {
        fs.readdir(dirPath, (err, files) => {
            if (err) reject(err);
            resolve(files);
        })
    })
}

const isFile = async (filenameWithPath: string): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        fs.stat(filenameWithPath, (err, stats) => {
            if (err) reject(err);
            resolve(stats.isFile());
        })
    })
}

export const analyzeTestFiles = async (): Promise<boolean> => {
    const dirPath = path.join(process.cwd(), 'packages/e2e');
    const names = (await readFromDirectory(dirPath)).map(name => ['', name]);
    const fileNames = [];
    for (const [dir, name] of names) {
        const joined = path.join(dirPath, dir, name);
        if (await isFile(joined)) {
            fileNames.push([dir, name].join('/'))
        } else {
            names
                .push(
                    ...(await readFromDirectory(joined))
                        .map((foundName) => [[dir, name].join('/'), foundName])
                )
        }
    }

    const testFileNames = fileNames.filter(name => /\**\.(spec|test)\.ts/.test(name));

    const testNames = testFileNames
        .map((name) => {
            const fileContents = fs.readFileSync(path.join(dirPath, name), 'utf8') ?? '';
            return (fileContents.match(/test\('(.+?)',/g) ?? []).map((title) => {
                return title.slice(6, -2);
            })
        })
        .flat()
        .filter(Boolean);

    return new Promise((resolve, reject) => {

        const ws = fs.createWriteStream(path.join(process.cwd(), 'packages/server/data/tests.json'));
        ws.on('close', () => resolve(true))
        ws.on('error', () => reject(new Error('파일 작성 중 에러 발생')));
        ws.write(JSON.stringify(testNames));
        ws.close();
    })
}

export const getTestNames = () => {
    const fileContents = fs.readFileSync(path.join(process.cwd(), 'packages/server/data/tests.json'), 'utf8') ?? '';
    return JSON.parse(fileContents);
}
