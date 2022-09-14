import { readFileSync } from 'node:fs';

import { parse } from 'markdown-code-block-meta';
import pMemoize from 'p-memoize';

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
      (error) =>
        `Error: ${error.message
          .replace('::1', 'localhost')
          .replace('127.0.0.1', 'localhost')}`,
    )
    .then((data) =>
      Buffer.from(
        typeof data === 'string'
          ? fail.replace('======', data.slice(0, 500))
          : data,
      ),
    );
}

export const mime = 'image/svg+xml';

function base64Url(base64) {
  return `data:${mime};base64,${base64}`;
}

export function toDataURL(buffer) {
  const base64 = buffer.toString('base64');

  return base64Url(base64);
}

export const fetchData = pMemoize(Fetch, {
  cacheKey: (arguments_) => JSON.stringify(arguments_),
});
