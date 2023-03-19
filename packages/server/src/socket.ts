import {createServer} from "http";
import {spawn} from "child_process";
import {createWriteStream} from "fs";
import {Server} from "socket.io";
import Convert from 'ansi-to-html';
import path from "path";

const convert = new Convert();

const startSocket = (listener: any) => {
    const httpServer = createServer(listener);
    const io = new Server(httpServer, {})

    io.on('connection', (socket) => {
        socket.on('run test', (testName = '', open = false) => {
            const script = spawn('yarn', ['exec', 'playwright', 'test', '-g', testName, open ? '--headed' : '']) //'e2e:start'
            script.stdout.on('data', (data) => {
                socket.emit('test log', convert.toHtml(data.toString()));
            })
        })

        socket.on('set auth', async (username, password) => {
            await spawn('mkdir', ['-p', process.cwd() + 'playwright/.auth']);
            await spawn('touch', [process.cwd() + 'playwright/.auth/user.json']);
            await spawn('touch', [process.cwd() + '.env']);
            const stream = createWriteStream(path.join(process.cwd(), '.env')) // 흠.......
            stream.on('close', () => socket.emit('set auth done'));
            stream.write(`USERNAME: ${username}\nPASSWORD: ${password}`);
            stream.end();
        })
    })

    return httpServer;
}

export default startSocket;
