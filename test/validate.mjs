import test from 'ava';

import { transform } from './helper/lib.mjs';

function marco(t, ...configs) {
  for (const config of configs) {
    const error = t.throws(() => transform('', config), {
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
