import test from 'ava';

import { TransformSnapshot } from './helper/lib.mjs';

function macro(t, { output }) {
  return TransformSnapshot(
    t,
    `
  \`\`\`kroki type=plantuml
    A --> B
  \`\`\`
  `,
    {
      server: 'https://kroki.io',
      output,
    },
  );
}

test('inline-svg', macro, { output: 'inline-svg' });

test('img-base64', macro, { output: 'img-base64' });

test('img-html-base64', macro, { output: 'img-html-base64' });

test('object-base64', macro, { output: 'object-base64' });
