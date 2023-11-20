const logger = require('./logger');
const { pushWithBark, pushWithFetch } = require('./push');
const tcping = require('./tcping');

module.exports = class DeviceChecker {
  /**
   * @param {DeviceConfig} conf
   */
  constructor(conf) {
    /** @private */
    this.conf = conf;
  }
  async start() {
    const { check, address } = this.conf;

    if (!check?.push) return;

    const { push, port } = check;
    const target = check.ip || address;

    if (!(target && (push.bark || push.fetch?.url))) return;

    return this.startChecking(target, port);
  }

  /**
   * @private
   * @param {string} address
   * @param {number} port
   */
  async startChecking(address, port = 3389) {
    const target = `${address}:${port}`;
    logger.log(`Start checking ${target}`);

    const timeoutTime = Date.now() + 5 * 60 * 1000;

    while (Date.now() < timeoutTime) {
      const canPing = await tcping(address, port);
      if (canPing) {
        const text = `${target} is available`;
        logger.log(text);
        return this.pushResult(text);
      }
    }

    const text = `${target} cannot ping`;
    logger.log(text);
    return this.pushResult(text);
  }

  /**
   * @private
   * @param {string} text
   */
  async pushResult(text) {
    const push = this.conf.check?.push;
    if (!push) return;

    const promises = [];

    if (push.bark) promises.push(pushWithBark(push.bark, text));
    if (push.fetch) promises.push(pushWithFetch(push.fetch, text));

    await Promise.all(promises);
  }
};
