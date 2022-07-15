/* eslint-disable no-new */

import { strict as assert } from 'assert';
import { readFileSync } from 'fs';

// eslint-disable-next-line import/no-unresolved
import pMemoize from 'p-memoize';

const allow = ['type', 'alt'];

export function parseMeta(meta = '') {
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

export function isKroki(alias = []) {
  return ({ type, lang, meta, value }) => {
    return (
      type === 'code' &&
      value &&
      value.trim() &&
      (alias.includes(lang) ||
        (lang === 'kroki' && meta && parseMeta(meta).type))
    );
  };
}

const nodeFetch = (...args) =>
  import('node-fetch').then(({ default: f }) => f(...args));

function Fetch({ server, headers = {}, type, value }) {
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
      () => readFileSync(new URL('fail.svg', import.meta.url)),
    )
    .then((buffer) => buffer.toString('base64'))
    .then((base64) => base64Url(base64));
}

export const fetchData = pMemoize(Fetch, {
  cacheKey: (arguments_) => JSON.stringify(arguments_),
});

export function validate({ server, headers, alias }) {
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

    assert(
      ['http:', 'https:'].includes(new URL(server).protocol),
      new TypeError('`server` protocol should be http or https'),
    );

    assert(
      typeof headers === 'object',
      new TypeError('`headers` should be an object'),
    );

    assert(
      Object.values(headers).every((item) => typeof item === 'string'),
      new TypeError('`headers` should an object of string'),
    );

    assert(Array.isArray(alias), new TypeError('`alias` should be an array'));

    assert(
      alias.every((item) => typeof item === 'string' && item.trim()),
      new TypeError('`alias` should an array of non empty string'),
    );
  } catch (error) {
    throw error.actual || error;
  }
}
