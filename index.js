const { readFileSync } = require('fs');
const YAML = require('yaml');
const Koa = require('koa');
const wol = require('wol');

/** @type {{ port: number, devices: Array<{ id: string, mac: string, address?: string, port?: number }> }} */
const config = YAML.parse(readFileSync('./config.yml').toString());

const device = new Map(config.devices.map(d => [d.id, d]));

const app = new Koa();

app.use(async ctx => {
  const id = ctx.request.url.replace(/^\//, '');
  if (!device.has(id)) return;
  const conf = device.get(id);
  const { mac, address, port } = conf;
  const options = {};
  if (address) options.address = address;
  if (port) options.port = port;
  try {
    await wol.wake(mac, options);
    ctx.status = 200;
    console.log(new Date().toLocaleString(), '| Wake from', ctx.request.ip, JSON.stringify(conf));
  } catch (e) {
    ctx.status = 500;
    console.error(new Date().toLocaleString(), '| Wake failed from', ctx.request.ip, JSON.stringify(conf));
    console.error(e);
  }
});

app.listen(config.port);
