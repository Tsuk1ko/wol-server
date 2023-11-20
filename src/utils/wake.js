const wol = require('wol');
const { device } = require('./config');
const DeviceChecker = require('./check');

/**
 * @param {string} id
 */
module.exports = async id => {
  const conf = device.get(id);
  if (!conf || !conf.mac) {
    throw new Error('config missing');
  }

  const { mac, address, port } = conf;
  const options = {};
  if (address) options.address = address;
  if (port) options.port = port;

  const result = await wol.wake(mac, options);
  if (!result) {
    throw new Error('wol.wake failed');
  }

  new DeviceChecker(conf).start();
};
