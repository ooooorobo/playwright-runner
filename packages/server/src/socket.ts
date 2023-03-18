import {createServer} from "http";
import {spawn} from "child_process";
import {Server} from "socket.io";
import Convert from 'ansi-to-html';

const convert = new Convert();

const startSocket = (listener: any) => {
    const httpServer = createServer(listener);
    const io = new Server(httpServer, {})

    io.on('connection', (socket) => {
        socket.on('run test', () => {
            const script = spawn('yarn', ['e2e:start'])
            script.stdout.on('data', (data) => {
                console.log(data.toString())
                socket.emit('test log', convert.toHtml(data.toString()));
            })
        })
    })

    return httpServer;
}

export default startSocket;
