import test from 'ava';
import type { ExecutionContext } from 'ava';

import { transform } from './helper/lib.mts';

async function marco(t: ExecutionContext, ...configs: object[]) {
  for (const config of configs) {
    const error = await t.throwsAsync(transform('', config), {
      instanceOf: TypeError,
    });

    t.snapshot(error);
  }
}

test(
  'server',
  marco,
  { server: 1 },
  { server: '55' },
  { server: 'ftp://localhost' },
);

test(
  'headers',
  marco,
  { headers: true },
  { headers: [] },
  { headers: null },
  { headers: { a: 0 } },
);

test(
  'alias',
  marco,
  { alias: true },
  { alias: null },
  { alias: [''] },
  { alias: [' '] },
);

test(
  'output',
  marco,
  { output: true },
  { output: null },
  { output: '' },
  { output: 'any' },
);

test(
  'target',
  marco,
  { target: true },
  { target: null },
  { target: '' },
  { target: 'any' },
);
