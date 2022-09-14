import { getValue, parse } from 'markdown-code-block-meta';

import { fetchData, toDataURL } from './utils.mjs';

/* eslint-disable no-param-reassign */

const modes = {
  'inline-svg': ({ node, diagramType, data, alt }) => {
    node.type = 'html';
    node.value = `<div class="kroki" data-type="${diagramType}" data-alt="${alt}">${data}</div>`;
  },
  base64: ({ node, diagramType, data, alt }) => {
    node.type = 'paragraph';
    node.children = [
      {
        type: 'image',
        alt: alt || diagramType,
        url: toDataURL(data),
      },
    ];
  },
};

export const outputType = Object.keys(modes);

export async function transform({ node, server, headers, output }) {
  const { meta, value, lang } = node;

  const object = parse(meta);

  const alt = getValue(object.get('alt'));
  const type = getValue(object.get('type'));

  const diagramType = lang === 'kroki' ? type : lang;

  const data = await fetchData({
    server,
    headers,
    type: diagramType,
    value,
  });

  delete node.lang;
  delete node.value;
  delete node.meta;

  modes[output]({ node, diagramType, data, alt });
}
