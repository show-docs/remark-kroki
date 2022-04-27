'use strict';

/* eslint-disable no-new */

const { readFileSync } = require('fs');
const { join } = require('path');
const pMemoize = require('p-memoize');
const assert = require('assert').strict;

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

function fetch({ server, headers = {}, type, value }) {
  return nodeFetch(`${server}/${type}/svg`, {
    method: 'POST',
    body: value,
    headers: {
      ...headers,
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

function validate({ server, headers }) {
  try {
    assert(
      typeof server === 'string',
      new TypeError('`server` should be a string'),
    );

    assert.doesNotThrow(() => {
      try {
        new URL(server);
      } catch {
        throw new TypeError('`server` should be an URL');
      }
    });

    assert.doesNotThrow(() => {
      if (!['http:', 'https:'].includes(new URL(server).protocol)) {
        throw new TypeError('`server` protocol should be http or https');
      }
    });

    assert(
      typeof headers === 'object',
      new TypeError('`headers` should be an object'),
    );

    assert.doesNotThrow(() => {
      if (!Object.values(headers).every((item) => typeof item === 'string')) {
        throw new TypeError('`headers` should an object of string');
      }
    });
  } catch (error) {
    throw error.actual || error;
  }
}

module.exports = { fetchData, parseMeta, isKroki, validate };
