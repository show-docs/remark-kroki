import test from 'ava';

import { macro } from './helper/lib.mjs';

const server = 'https://kroki.io';

const input = `
\`\`\`kroki type=plantuml
  A --> B
\`\`\`
`;

test('inline-svg', macro, input, { server, output: 'inline-svg' });

test('img-base64', macro, input, { server, output: 'img-base64' });

test('img-html-base64', macro, input, { server, output: 'img-html-base64' });

test('object-base64', macro, input, { server, output: 'object-base64' });
