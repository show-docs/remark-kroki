import test from 'ava';

import { TransformSnapshot } from './helper/lib.mjs';

test(
  'empty',
  TransformSnapshot,
  `
\`\`\`kroki
\`\`\`

\`\`\`kroki type=plantuml
\`\`\`
`,
);

test(
  'okay',
  TransformSnapshot,
  `
\`\`\`kroki type=plantuml alt=abc
  A --> B
\`\`\`
`,
  { server: 'https://kroki.io' },
);

test(
  'alias',
  TransformSnapshot,
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
