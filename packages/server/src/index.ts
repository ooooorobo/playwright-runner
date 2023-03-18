import Koa from 'koa';

import {createReadStream} from 'fs';
import path from 'path';
import serve from "koa-static";

const app = new Koa();
app.use(serve(__dirname + '/public'))
app.use(async (ctx) => {
    ctx.type = 'html';
    ctx.body = createReadStream(path.join(__dirname, './index.html'))
})

app.listen(3000);
