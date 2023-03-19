import {createServer} from "http";
import {spawn} from "child_process";
import {Server} from "socket.io";
import Convert from 'ansi-to-html';

const convert = new Convert();

const startSocket = (listener: any) => {
    const httpServer = createServer(listener);
    const io = new Server(httpServer, {})

    io.on('connection', (socket) => {
        socket.on('run test', (testName = 'all', open = false, debug = false) => {
            const script = spawn('yarn', [
                'exec', 'playwright', 'test',
                testName === 'all' ? '' : `-g ${testName}`,
                open ? '--headed' : '',
                debug ? '--debug' : '',
            ])
            script.stdout.on('data', (data) => {
                socket.emit('test log', convert.toHtml(data.toString()));
            })
        })

        socket.on('set auth', async (username, password) => {

        })
    })

    return httpServer;
}

export default startSocket;
