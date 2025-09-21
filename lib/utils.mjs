import { readFileSync } from 'node:fs';

import { parse } from 'markdown-code-block-meta';
import pMemoize from 'p-memoize';

import { httpPost } from './fetch.mjs';

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

const failImage = new URL('fail.svg', import.meta.url);

function createFailImage(server, message) {
  console.error(message);

  return readFileSync(failImage, 'utf8').replace(
    '======',
    message.replaceAll(server, '$server').slice(0, 500),
  );
}

function Fetch({ server, headers, type, diagram_source, diagram_options }) {
  const serverURL = server.replace(/\/$/, '');

  return httpPost({
    url: serverURL,
    headers,
    body: JSON.stringify({
      diagram_type: type,
      output_format: 'svg',
      diagram_source,
      diagram_options,
    }),
  })
    .catch((error) => createFailImage(serverURL, error.message))
    .then((data) => Buffer.from(data));
}

export const mime = 'image/svg+xml';

export function toDataURL(buffer) {
  const base64 = buffer.toString('base64');

  return `data:${mime};base64,${base64}`;
}

export const fetchData = pMemoize(Fetch, {
  cacheKey: (arguments_) => JSON.stringify(arguments_),
});
