import { visit } from 'unist-util-visit';

import { outputType, transform } from './transform.mjs';
import { isKroki } from './utils.mjs';
import { validate } from './validate.mjs';

export function remarkKroki({
  server = 'http://localhost:8000',
  headers = {},
  alias = [],
  output = outputType[0],
  target = 'html',
} = {}) {
  validate({ server, headers, alias, output, target });

  const condition = isKroki(alias);

  return async (tree) => {
    const temp = [];

    visit(tree, condition, (node) => {
      temp.push(transform({ node, server, headers, output, target }));
    });

    // eslint-disable-next-line no-empty
    for await (const _ of temp) {
    }
  };
}
