'use strict';

const { readFileSync } = require('fs');
const { join } = require('path');
const pMemoize = require('p-memoize');

const allow = ['type', 'alt'];

function parseMeta(meta = '') {
  return Object.fromEntries(
    (meta || '')
      .split(/\s+/)
      .map((item) => item.split('=', 2))
      .filter(([key]) => allow.includes(key)),
  );
}

function base64Url(base64) {
  return `data:image/svg+xml;base64,${base64}`;
}

function isKroki({ type, lang, meta, value }) {
  return (
    type === 'code' &&
    lang === 'kroki' &&
    value &&
    value.trim() &&
    meta &&
    parseMeta(meta).type
  );
}

const nodeFetch = (...args) =>
  import('node-fetch').then(({ default: f }) => f(...args));

function fetch({ server, type, value }) {
  return nodeFetch(`${server}/${type}/svg`, {
    method: 'POST',
    body: value,
    headers: {
      'Content-Type': 'text/plain',
    },
  })
    .then((response) => {
      if (!response.ok || response.statusCode >= 400) {
        throw new Error('kroki fail');
      }

      return response.arrayBuffer();
    })
    .then(
      (arrayBuffer) => Buffer.from(arrayBuffer),
      () => readFileSync(join(__dirname, 'fail.svg')),
    )
    .then((buffer) => buffer.toString('base64'))
    .then((base64) => base64Url(base64));
}

const fetchData = pMemoize(fetch, {
  cacheKey: (arguments_) => JSON.stringify(arguments_),
});

module.exports = { fetchData, parseMeta, isKroki };
