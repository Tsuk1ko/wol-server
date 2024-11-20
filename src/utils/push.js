const { resolve } = require('url');
const logger = require('./logger');

const TEXT_PLACEHOLDER_REG = /{{text}}/g;

/**
 * @param {string} url
 * @param {string} text
 */
const pushWithBark = async (url, text) => {
  try {
    if (!url.endsWith('/')) url = `${url}/`;
    logger.log('Push with bark', url);
    await fetch(
      resolve(url, `${encodeURIComponent('WOL')}/${encodeURIComponent(text)}?isArchive=0`)
    );
  } catch (error) {
    logger.error('Push with bark failed');
    console.error(error);
  }
};

/**
 * @param {NonNullable<PushConfig['fetch']>} conf
 * @param {string} text
 */
const pushWithFetch = async ({ url, options }, text) => {
  try {
    const encodedText = encodeURIComponent(text);
    url = url.replace(TEXT_PLACEHOLDER_REG, encodedText);

    if (typeof options?.body === 'string' && isJsonFetch(options.headers)) {
      options = {
        ...options,
        body: options.body.replace(TEXT_PLACEHOLDER_REG, encodedText),
      };
    }

    logger.log('Push with fetch', { url, options });
    await fetch(url, options);
  } catch (error) {
    logger.error('Push with fetch failed');
    console.error(error);
  }
};

/**
 * @param {*} headers
 */
const isJsonFetch = headers => {
  if (!headers) return false;
  const kv = Object.entries(headers).find(([k, v]) => k.toLowerCase() === 'content-type');
  return kv?.[1] === 'application/json';
};

/**
 * @param {string} url
 * @param {string} text
 */
const pushWithNtfy = async (url, text) => {
  try {
    logger.log('Push with ntfy', url);
    await fetch(url, {
      method: 'POST',
      body: text,
    });
  } catch (error) {
    logger.error('Push with bark ntfy');
    console.error(error);
  }
};

/**
 * @type {Record<string, Function>}
 */
module.exports = {
  bark: pushWithBark,
  fetch: pushWithFetch,
  ntfy: pushWithNtfy,
};
