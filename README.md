# remark-kroki

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

```cjs
const readFileSync = require('fs');
const remark = require('remark');
const kroki = require('remark-kroki');

const markdownText = readFileSync('example.md', 'utf8');

remark()
  .use(kroki, {
    server: 'http://localhost:8000'
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

## Related

- [remark-code-example](https://github.com/nice-move/remark-code-example)
