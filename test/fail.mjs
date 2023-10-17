import test from 'ava';

import { macro2 as macro } from './helper/lib.mjs';

test(
  'input',
  macro,
  `
\`\`\`kroki type=plantuml alt=00
ss
\`\`\`
`,
  { server: 'https://kroki.io' },
);

test(
  '404',
  macro,
  `
\`\`\`kroki type=fake
ss
\`\`\`
`,
  { server: 'https://kroki.io' },
);

test(
  'timeout',
  macro,
  `
\`\`\`kroki type=plantuml alt="0 0"
ss
\`\`\`
`,
);
