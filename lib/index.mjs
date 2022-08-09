/* eslint-disable no-param-reassign */

import { getValue, parse } from 'markdown-code-block-meta';
import { visit } from 'unist-util-visit';

import { fetchData, isKroki, validate } from './utils.mjs';

async function transform({ node, server, headers }) {
  const { meta, value, lang } = node;

  const object = parse(meta);

  const alt = getValue(object.get('alt'));
  const type = getValue(object.get('type'));

  const t = lang === 'kroki' ? type : lang;

  const url = await fetchData({
    server,
    headers,
    type: t,
    value,
  });

  delete node.lang;
  delete node.value;
  delete node.meta;

  node.type = 'paragraph';
  node.children = [
    {
      type: 'image',
      alt: alt || t,
      url,
    },
  ];
}

export function remarkKroki({
  server = 'http://localhost:8000',
  headers = {},
  alias = [],
} = {}) {
  validate({ server, headers, alias });

  const condition = isKroki(alias);

  return async (tree) => {
    const temp = [];

    visit(tree, condition, (node) => {
      temp.push(transform({ node, server, headers }));
    });

    for (const action of temp) {
      await action;
    }
  };
}
