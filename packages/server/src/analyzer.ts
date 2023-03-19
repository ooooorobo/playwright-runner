import * as fs from "fs";
import path from "path";
import * as process from "process";

export const analyzeTestFiles = (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
        const dirPath = path.join(process.cwd(), 'packages/e2e');
        const files = fs.readdirSync(dirPath);
        const filtered = files.filter(name => /\**\.(spec|test)\.ts/.test(name));

        const testNames = filtered
            .map((name) => {
                const fileContents = fs.readFileSync(path.join(dirPath, name), 'utf8') ?? '';
                return (fileContents.match(/test\('(.+?)',/g) ?? []).map((title) => {
                    return title.slice(6, -2);
                })
            })
            .flat()
            .filter(Boolean);

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
