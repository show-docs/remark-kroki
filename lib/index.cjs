/* eslint-disable no-param-reassign */

'use strict';

const visit = require('unist-util-visit');
const { fetchData, parseMeta, isKroki } = require('./utils.cjs');

async function transform({ node, server }) {
  const { meta, value } = node;

  const { type, alt } = parseMeta(meta);

  const url = await fetchData({ server, type, value });

  delete node.lang;
  delete node.value;
  delete node.meta;

  node.type = 'paragraph';
  node.children = [
    {
      type: 'image',
      alt: alt || type,
      url,
    },
  ];
}

module.exports = function plugin({ server = 'http://localhost:8000' } = {}) {
  return async (tree) => {
    const temp = [];

    visit(tree, isKroki, (node) => {
      temp.push(transform({ node, server }));
    });

    for (const action of temp) {
      await action;
    }
  };
};
