import { strict as assert } from 'node:assert';

import isPlainObject from 'is-plain-obj';

import { outputType } from './transform.mjs';

const targets = ['html', 'mdx3'];

export function validate({ server, headers, alias, output, target }) {
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

    assert(
      outputType.includes(output),
      new TypeError(`\`output\` should be one of \`${outputType.join('/')}\``),
    );

    assert(
      targets.includes(target),
      new TypeError(`\`target\` should be one of \`${targets.join('/')}\``),
    );
  } catch (error) {
    throw error.actual || error;
  }
}
