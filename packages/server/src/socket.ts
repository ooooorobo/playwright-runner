import {createServer} from "http";
import {spawn} from "child_process";
import {Server} from "socket.io";
import Convert from 'ansi-to-html';

const convert = new Convert();

const startSocket = (listener: any) => {
    const httpServer = createServer(listener);
    const io = new Server(httpServer, {})

    io.on('connection', (socket) => {
        socket.on('run test', (testName = 'all', {openBrowser = false, useDebug = false, showReport = false}) => {
            const script = spawn('yarn', [
                'exec', 'playwright', 'test',
                testName === 'all' ? '' : `-g ${testName}`,
                openBrowser ? '--headed' : '',
                useDebug ? '--debug' : '',
            ])
            script.stdout.on('data', (data) => {
                socket.emit('test log', convert.toHtml(data.toString()));
            })
            script.stderr.on('data', (data) => {
                socket.emit('test log', convert.toHtml(data.toString()));
            })
            script.on('close', () => {
                socket.emit('test log ended');
                if (showReport) {
                    spawn('yarn', ['exec', 'playwright', 'show-report']);
                }
            })
        })
    })

    return httpServer;
}

export default startSocket;
