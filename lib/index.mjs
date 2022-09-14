import { visit } from 'unist-util-visit';

import { outputType, transform } from './transform.mjs';
import { isKroki } from './utils.mjs';
import { validate } from './validate.mjs';

export function remarkKroki({
  server = 'http://localhost:8000',
  headers = {},
  alias = [],
  output = outputType[0],
} = {}) {
  validate({ server, headers, alias, output });

  const condition = isKroki(alias);

  return async (tree) => {
    const temp = [];

    visit(tree, condition, (node) => {
      temp.push(transform({ node, server, headers, output }));
    });

    for (const action of temp) {
      await action;
    }
  };
}
