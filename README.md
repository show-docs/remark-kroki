# remark-kroki

Remark plugin for showing Kroki diagram.

[![npm][npm-badge]][npm-url]
[![github][github-badge]][github-url]
![node][node-badge]

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

## Options

### Options.server

- type: string
- default: http://localhost:8000

Using self host server by default. Set `https://kroki.io` to use free service.

### Options.headers

- type: object

HTTP headers to send to the server for custom authentication.

### Options.alias

- type: array
- example: `['plantuml']`

Alias code language name to treat as kroki code block, meta.type will be ignored.

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

## Related

- [markdown-code-block-meta](https://github.com/nice-move/markdown-code-block-meta)
- [remark-code-example](https://github.com/nice-move/remark-code-example)
- [remark-docusaurus](https://github.com/nice-move/remark-docusaurus)
