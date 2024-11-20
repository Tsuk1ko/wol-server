const logger = require('./logger');
const pushMethodMap = require('./push');
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
    const { checks, address } = this.conf;

    if (!checks?.length) return;

    await Promise.all(
      checks.map(check => {
        if (!check?.push) return;

        const { push, port } = check;
        const target = check.ip || address;

        if (!(target && Object.keys(push).length)) return;

        return this.startChecking(check, target, port);
      })
    );
  }

  /**
   * @private
   * @param {CheckConfig} conf
   * @param {string} address
   * @param {number} port
   */
  async startChecking(conf, address, port = 3389) {
    const target = `${address}:${port}`;
    logger.log(`Start checking ${target}`);

    const timeoutTime = Date.now() + 5 * 60 * 1000;

    while (Date.now() < timeoutTime) {
      const canPing = await tcping(address, port);
      if (canPing) {
        const text = `${target} is available`;
        logger.log(text);
        return this.pushResult(conf, text);
      }
    }

    const text = `${target} cannot ping`;
    logger.log(text);
    return this.pushResult(conf, text);
  }

  /**
   * @private
   * @param {CheckConfig} conf
   * @param {string} text
   */
  async pushResult({ push }, text) {
    /**
     * @type {Promise<any>[]}
     */
    const promises = [];

    Object.entries(push).forEach(([name, option]) => {
      if (!(name in pushMethodMap)) return;
      promises.push(pushMethodMap[name](option, text));
    });

    await Promise.all(promises);
  }
};
