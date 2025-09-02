/**
 * @param {string} method
 * @returns {(...data: any[]) => void}
 */
const wrapConsole =
  method =>
  (...args) => {
    // @ts-ignore
    console[method](new Date().toLocaleString(), '|', ...args);
  };

module.exports = {
  log: wrapConsole('log'),
  warn: wrapConsole('warn'),
  error: wrapConsole('error'),
};
