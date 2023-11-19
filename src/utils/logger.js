const wrapConsole =
  method =>
  (...args) => {
    console[method](new Date().toLocaleString(), '|', ...args);
  };

module.exports = {
  log: wrapConsole('log'),
  warn: wrapConsole('warn'),
  error: wrapConsole('error'),
};
