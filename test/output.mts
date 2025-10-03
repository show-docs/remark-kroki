import test from 'ava';
import type { ExecutionContext } from 'ava';

import { TransformSnapshot } from './helper/lib.mts';

test.before((t) => {
  t.timeout(1000 ** 3);
});

const source = `
\`\`\`kroki type=plantuml classnames=w-half
  A --> B
\`\`\`
`;

function macro(t: ExecutionContext, options = {}) {
  return TransformSnapshot(t, source, {
    ...options,
    server: 'https://kroki.io',
  });
}

const mode = ['inline-svg', 'img-base64', 'img-html-base64', 'object-base64'];

const targets = ['html', 'mdx3'];

for (const output of mode) {
  if (output === mode[1]) {
    test(output, macro, { output });
  } else {
    for (const target of targets) {
      test(`${output} | ${target}`, macro, { output, target });
    }
  }
}
