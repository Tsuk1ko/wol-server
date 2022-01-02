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
  const { mac, address, port } = device.get(id);
  const options = {};
  if (address) options.address = address;
  if (port) options.port = port;
  await wol.wake(mac, options);
  ctx.status = 200;
});

app.listen(config.port);
