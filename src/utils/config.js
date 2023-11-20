const { readFileSync } = require('fs');
const { parse } = require('yaml');

/** @type {Config} */
const config = parse(readFileSync('./config.yml').toString());

const device = new Map(config.devices.map(d => [d.id, d]));

module.exports = {
  port: config.port,
  device,
};
