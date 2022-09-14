import test from 'ava';

import { transform } from './helper/lib.mjs';

async function macro(t, input, options) {
  const output = await transform(input, options);

  t.snapshot(output.trim());
}

test(
  'empty',
  macro,
  `
\`\`\`kroki
\`\`\`

\`\`\`kroki type=plantuml
\`\`\`
`,
);

test(
  'fail:input',
  macro,
  `
\`\`\`kroki type=plantuml alt=00
ss
\`\`\`
`,
  { server: 'https://kroki.io' },
);

test(
  'fail:server',
  macro,
  `
\`\`\`kroki type=plantuml alt="0 0"
ss
\`\`\`
`,
);

test(
  'okay',
  macro,
  `
\`\`\`kroki type=plantuml alt=abc
  A --> B
\`\`\`
`,
  { server: 'https://kroki.io' },
);

test(
  'alias',
  macro,
  `
\`\`\`plantuml type=mermaid alt=abc
  A --> B
\`\`\`
`,
  {
    server: 'https://kroki.io',
    alias: ['plantuml'],
  },
);
