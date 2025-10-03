import test from 'ava';

import { TransformSnapshot } from './helper/lib.mts';

test(
  'input',
  TransformSnapshot,
  `
\`\`\`kroki type=plantuml alt=00
ss
\`\`\`
`,
  { server: 'https://kroki.io' },
  false,
);

test(
  '404',
  TransformSnapshot,
  `
\`\`\`kroki type=fake
ss
\`\`\`
`,
  { server: 'https://kroki.io' },
  false,
);
