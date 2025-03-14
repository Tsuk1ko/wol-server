const Koa = require('koa');
const logger = require('./utils/logger');
const wake = require('./utils/wake');
const ping = require('./utils/ping');
const { port, device } = require('./utils/config');

const app = new Koa();

app.use(async ctx => {
  const [id, cmd] = ctx.request.url.replace(/^\//, '').split('/');
  if (!device.has(id)) {
    ctx.status = 404;
    return;
  }

  switch (cmd) {
    case '':
    case undefined: {
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
      break;
    }
    case 'ping': {
      try {
        const results = await ping(id);
        logger.log(`Ping "${id}" from ${ctx.request.ip} succeeded`);
        ctx.status = 200;
        ctx.body = results.join(',');
      } catch (error) {
        ctx.status = 500;
        ctx.body = String(error);
        logger.error(`Ping "${id}" from ${ctx.request.ip} failed`);
        console.error(error);
      }
      break;
    }
    default:
      ctx.status = 404;
      break;
  }
});

app.listen(port, () => {
  logger.log(`WOL server start at port ${port}`);
});
