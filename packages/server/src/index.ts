import Koa from 'koa';

import {createReadStream} from 'fs';
import path from 'path';
import serve from "koa-static";

import startSocket from "./socket";
import {spawn} from "child_process";

const app = new Koa();
app.use(serve(__dirname + '/public'))
app.use(async (ctx) => {
    ctx.type = 'html';
    ctx.body = createReadStream(path.join(__dirname, './index.html'))

    console.log('hi')
    const script = spawn('yarn run e2e:start')
    script.stdout.on('data', (data) => {
        console.log(data)
    })
})

const httpServer = startSocket(app.callback());
httpServer.listen(3000);
