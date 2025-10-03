import test from 'ava';

import { TransformSnapshot } from './helper/lib.mts';

test(
  'okay',
  TransformSnapshot,
  `
\`\`\`kroki type=plantuml Kroki-Diagram-Options-theme=amiga
  A --> B
\`\`\`
`,
  { server: 'https://kroki.io' },
);

test(
  'alias',
  TransformSnapshot,
  `
\`\`\`plantuml type=mermaid alt=abc Kroki-Diagram-Options-theme=amiga
  A --> B
\`\`\`
`,
  {
    server: 'https://kroki.io',
    alias: ['plantuml'],
  },
);
