const crypto = require('crypto');

/**
 * 计算钉钉签名
 * @param {string} secret 钉钉机器人密钥
 * @returns {{ timestamp: string; sign: string }}
 */
function dingTalkSign(secret) {
  const timestamp = Date.now().toString();
  const stringToSign = `${timestamp}\n${secret}`;
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(stringToSign);
  const hmacCode = hmac.digest();
  const sign = hmacCode.toString('base64');
  return {
    timestamp,
    sign,
  };
}

module.exports = {
  dingTalkSign,
};
