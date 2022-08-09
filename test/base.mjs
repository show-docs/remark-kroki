import { readFileSync } from 'fs';

// eslint-disable-next-line import/no-unresolved
import test from 'ava';

import { getUtils, transform } from './helper/lib.mjs';

test('emtpy', async (t) => {
  const input = `
\`\`\`kroki
\`\`\`

\`\`\`kroki type=plantuml
\`\`\`
`;

  const expected = `
\`\`\`kroki
\`\`\`

\`\`\`kroki type=plantuml
\`\`\`
`;

  const output = await transform(input);

  getUtils(t).sameText(output, expected);
});

function base64Url(base64) {
  return `data:image/svg+xml;base64,${base64}`;
}

const base64 = readFileSync('lib/fail.svg').toString('base64');

test('fail:input', async (t) => {
  const input = `
\`\`\`kroki type=plantuml alt=00
ss
\`\`\`
`;

  const expected = `
![00](${base64Url(base64)})
`;

  const output = await transform(input, { server: 'https://kroki.io' });

  getUtils(t).sameText(output, expected);
});

test('fail:server', async (t) => {
  const input = `
\`\`\`kroki type=plantuml alt="0 0"
ss
\`\`\`
`;

  const expected = `
![0 0](${base64Url(base64)})
`;

  const output = await transform(input);

  getUtils(t).sameText(output, expected);
});

test('okay', async (t) => {
  const input = `
\`\`\`kroki type=plantuml alt=abc
  A --> B
\`\`\`
`;

  const expected = '![abc](data:image/svg+xml;base64,PD94bWwgdmVyc2lv';

  const output = await transform(input, { server: 'https://kroki.io' });

  t.true(output.trim().startsWith(expected.trim()));
});

test('alias', async (t) => {
  const input = `
\`\`\`plantuml type=mermaid alt=abc
  A --> B
\`\`\`
`;

  const expected = '![abc](data:image/svg+xml;base64,PD94bWwgdmVyc2lv';

  const output = await transform(input, {
    server: 'https://kroki.io',
    alias: ['plantuml'],
  });

  t.true(output.trim().startsWith(expected.trim()));
});
