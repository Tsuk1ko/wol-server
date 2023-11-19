const { default: fetch } = require('node-fetch');
const { resolve } = require('url');

/**
 * @param {string} url
 * @param {string} text
 */
const pushToBark = async (url, text) => {
  if (!url.endsWith('/')) url = `${url}/`;
  await fetch(resolve(url, `${encodeURIComponent('WOL')}/${encodeURIComponent(text)}?isArchive=0`));
};
