import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';

import isPlainObject from 'is-plain-obj';
import { parse } from 'markdown-code-block-meta';
import pMemoize from 'p-memoize';

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
        (lang === 'kroki' && meta && parse(meta).has('type')))
    );
  };
}

const nodeFetch = (...args) =>
  import('node-fetch').then(({ default: f }) => f(...args));

const fail = readFileSync(new URL('fail.svg', import.meta.url), 'utf8');

function Fetch({ server, headers = {}, type, value }) {
  return nodeFetch(`${server}/${type}/svg`, {
    method: 'POST',
    body: value,
    headers: {
      ...headers,
      'Content-Type': 'text/plain',
    },
  })
    .then(
      (response) => {
        if (!response.ok || response.statusCode >= 400) {
          if (response.statusCode === 404) {
            return 'Error: 404';
          }

          return response.text();
        }

        return response.arrayBuffer();
      },
      (error) => `Error: ${error.message}`,
    )
    .then((data) =>
      Buffer.from(
        typeof data === 'string'
          ? fail.replace('======', data.slice(0, 500))
          : data,
      ),
    )
    .then((buffer) => buffer.toString());
}

export function toDataURL(data) {
  const buffer = Buffer.from(data);
  const base64 = buffer.toString('base64');

  return base64Url(base64);
}

export const fetchData = pMemoize(Fetch, {
  cacheKey: (arguments_) => JSON.stringify(arguments_),
});

export function validate({ server, headers, alias }) {
  try {
    assert(
      typeof server === 'string',
      new TypeError('`server` should be string'),
    );

    assert.doesNotThrow(() => {
      try {
        // eslint-disable-next-line no-new
        new URL(server);
      } catch {
        throw new TypeError('`server` should be URL');
      }
    });

    assert(
      ['http:', 'https:'].includes(new URL(server).protocol),
      new TypeError('`server` protocol should be http or https'),
    );

    assert(
      isPlainObject(headers),
      new TypeError('`headers` should be plain object'),
    );

    assert(
      Object.values(headers).every((item) => typeof item === 'string'),
      new TypeError('`headers` should object of string'),
    );

    assert(Array.isArray(alias), new TypeError('`alias` should be array'));

    assert(
      alias.every((item) => typeof item === 'string' && item.trim()),
      new TypeError('`alias` should array of non empty string'),
    );
  } catch (error) {
    throw error.actual || error;
  }
}
