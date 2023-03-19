import Koa from 'koa';
import Router from "koa-router";
import serve from "koa-static";
import bodyParser from 'koa-bodyparser';

import {spawn} from "child_process";
import {createReadStream, createWriteStream} from 'fs';
import path from 'path';

import startSocket from "./socket";
import {analyzeTestFiles, getTestNames} from "./analyzer";

const app = new Koa();
app.use(serve(__dirname + '/public'))
app.use(bodyParser());

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

router.get('/codegen', async (ctx) => {
    const url = ctx.request.query.url as string;
    spawn('yarn', ['exec', 'playwright', 'codegen', url || '']);
    ctx.body = true;
})

router.post('/set-auth', async (ctx) => {
    const {username, password} = ctx.request.body as { username: string, password: string };

    await spawn('mkdir', ['-p', process.cwd() + 'playwright/.auth']);
    await spawn('touch', [process.cwd() + 'playwright/.auth/user.json']);
    await spawn('touch', [process.cwd() + '.env']);
    const stream = createWriteStream(path.join(process.cwd(), '.env')) // 흠.......
    stream.write(`USERNAME: ${username}\nPASSWORD: ${password}`);
    stream.end();

    ctx.body = true;
})

app.use(router.routes());
app.use(router.allowedMethods());

const httpServer = startSocket(app.callback());
httpServer.listen(3000, () => {
    console.log('server is listening to port 3000')
});
