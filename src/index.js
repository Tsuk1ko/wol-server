const Koa = require('koa');
const logger = require('./utils/logger');
const wake = require('./utils/wake');
const { port, device } = require('./utils/config');

const app = new Koa();

app.use(async ctx => {
  const id = ctx.request.url.replace(/^\//, '');
  if (!device.has(id)) {
    ctx.status = 404;
    return;
  }

  try {
    await wake(id);
    logger.log(`Wake "${id}" from ${ctx.request.ip} succeeded`);
    ctx.status = 200;
  } catch (error) {
    ctx.status = 500;
    ctx.body = String(error);
    logger.error(`Wake "${id}" from ${ctx.request.ip} failed`);
    console.error(error);
  }
});

app.listen(port, () => {
  logger.log(`WOL server start at port ${port}`);
});
