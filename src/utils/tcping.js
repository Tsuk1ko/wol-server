const { ping } = require('tcp-ping');
const { promisify } = require('util');

const pingAsync = promisify(ping);

/**
 * @param {string} address
 * @param {number} port
 */
module.exports = async (address, port) => {
  try {
    const result = await pingAsync({
      address,
      port,
      timeout: 1000,
      attempts: 1,
    });
    return !result.results[0].err;
  } catch {
    return false;
  }
};
