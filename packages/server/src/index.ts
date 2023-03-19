import Koa from 'koa';
import Router from "koa-router";

import {createReadStream} from 'fs';
import path from 'path';
import serve from "koa-static";

import startSocket from "./socket";
import {analyzeTestFiles, getTestNames} from "./analyzer";

const app = new Koa();
app.use(serve(__dirname + '/public'))

const router = new Router();

router.get('/', async (ctx) => {
    ctx.type = 'html';
    ctx.body = createReadStream(path.join(__dirname, './index.html'))
})

router.get('/tests', async (ctx) => {
    ctx.body = getTestNames();
});

router.get('/start-analyze', async (ctx) => {
    ctx.body = await analyzeTestFiles();
})

app.use(router.routes());
app.use(router.allowedMethods());

const httpServer = startSocket(app.callback());
httpServer.listen(3000, () => {
    console.log('server is listening to port 3000')
});
