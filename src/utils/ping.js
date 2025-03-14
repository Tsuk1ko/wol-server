const { device } = require('./config');
const tcping = require('./tcping');

/**
 * @param {string} id
 */
module.exports = async id => {
  const conf = device.get(id);
  if (!conf?.checks?.length) {
    return [];
  }

  return Promise.all(
    conf.checks.map(item => {
      const address = item?.ip || conf.address;
      if (!address) return null;
      return tcping(address, item?.port ?? 3389);
    })
  );
};
