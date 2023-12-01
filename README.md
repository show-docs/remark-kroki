# remark-kroki

Remark plugin for showing [Kroki] diagram.

[![npm][npm-badge]][npm-url]
[![github][github-badge]][github-url]
![node][node-badge]

[kroki]: https://kroki.io
[npm-url]: https://www.npmjs.com/package/remark-kroki
[npm-badge]: https://img.shields.io/npm/v/remark-kroki.svg?style=flat-square&logo=npm
[github-url]: https://github.com/nice-move/remark-kroki
[github-badge]: https://img.shields.io/npm/l/remark-kroki.svg?style=flat-square&colorB=blue&logo=github
[node-badge]: https://img.shields.io/node/v/remark-kroki.svg?style=flat-square&colorB=green&logo=node.js

## Installation

```sh
npm install remark-kroki --save-dev
```

## Usage

```mjs
import readFileSync from 'node:fs';

import { remark } from 'remark';
import { remarkKroki } from 'remark-kroki';

const markdownText = readFileSync('example.md', 'utf8');

remark()
  .use(remarkKroki, {
    server: 'http://localhost:8000',
    alias: ['plantuml']
  })
  .process(markdownText)
  .then((file) => console.info(file))
  .catch((error) => console.warn(error));
```

### Docusaurus v3 project

```mjs
// docusaurus.config.mjs
import { remarkKroki } from 'remark-kroki';

export default {
  presets: [
    [
      'classic',
      {
        docs: {
          remarkPlugins: [
            [
              remarkKroki,
              {
                // ...options here
                alias: ['plantuml'],
                target: 'mdx3'
              }
            ]
          ]
        }
      }
    ]
  ]
};
```

### Docusaurus v2 project

```cjs
// docusaurus.config.js
module.exports = async function createConfig() {
  const { remarkKroki } = await import('remark-kroki');

  return {
    presets: [
      [
        'classic',
        {
          docs: {
            remarkPlugins: [
              [
                remarkKroki,
                {
                  // ...options here
                  alias: ['plantuml']
                }
              ]
            ]
          }
        }
      ]
    ]
  };
};
```

## Options

### Options.server

- type: string
- default: http://localhost:8000
- example: <https://kroki.io>

Using self host server by default. Set <https://kroki.io> to use free service.

### Options.headers

- type: object
- default: `{}`

HTTP headers to send to the server for custom authentication.

### Options.alias

- type: array
- default: `[]`
- example: `['plantuml']`

Alias code language name to treat as kroki code block, meta.type will be ignored.

### Options.target

- type: string
- default: `'html'`
- enum: `['html', 'mdx3']`

Transform HTML tags as MDX 3.0 AST or not. When you using Docusaurus v3, you should use `mdx3`.

### Options.output

- type: string
- default: `'img-base64'`
- enum: `['inline-svg', 'img-base64', 'img-html-base64', 'object-base64']`

How to embed SVG as image. See the different and risk on [Best Way To Embed SVG](https://vecta.io/blog/best-way-to-embed-svg).

## Syntax

````markdown
Turn

```kroki type=plantuml
  A --> B
```

Into

![plantuml](data:image/svg+xml;base64,xxxxxxxx)
````

````markdown
Turn

```kroki type=plantuml alt=abc
  A --> B
```

Into

![abc](data:image/svg+xml;base64,xxxxxxxx)
````

### Alias

````
```kroki type=plantuml
```
 ↓
```plantuml
```
````

## Troubleshooting

When you using `inline-svg` with `mdx3` mode, You may get following error:

```log
Error: Cannot handle unknown node `raw` when using with `@mdx-js/mdx`
```

You need to add `rehype-raw` to the complier, for example:

```mjs
// docusaurus.config.mjs
import rehypeRaw from 'rehype-raw';
import { remarkKroki } from 'remark-kroki';

export default {
  presets: [
    [
      'classic',
      {
        docs: {
          remarkPlugins: [
            [
              remarkKroki,
              {
                // ...options here
                target: 'mdx3',
                output: 'inline-svg'
              }
            ]
          ],
          rehypePlugins: [
            [
              rehypeRaw,
              {
                passThrough: [
                  'mdxFlowExpression',
                  'mdxJsxFlowElement',
                  'mdxJsxTextElement',
                  'mdxTextExpression',
                  'mdxjsEsm'
                ]
              }
            ]
          ]
        }
      }
    ]
  ]
};
```

## Related

- [markdown-code-block-meta](https://github.com/nice-move/markdown-code-block-meta)
- [rehype-extended-table](https://github.com/nice-move/rehype-extended-table)
- [remark-code-example](https://github.com/nice-move/remark-code-example)
- [remark-docusaurus](https://github.com/nice-move/remark-docusaurus)
