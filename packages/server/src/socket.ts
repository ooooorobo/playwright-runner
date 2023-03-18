import {createServer} from "http";
import {spawn} from "child_process";
import {Server} from "socket.io";
import Convert from 'ansi-to-html';

const convert = new Convert();

const startSocket = (listener: any) => {
    const httpServer = createServer(listener);
    const io = new Server(httpServer, {})

    io.on('connection', (socket) => {
        socket.on('run test', (testName = '') => {
            const script = spawn('yarn', ['exec', 'playwright', 'test', '-g', testName]) //'e2e:start'
            script.stdout.on('data', (data) => {
                socket.emit('test log', convert.toHtml(data.toString()));
            })
        })
    })

    return httpServer;
}

export default startSocket;
