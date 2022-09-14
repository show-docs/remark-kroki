import test from 'ava';

import { macro } from './helper/lib.mjs';

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
