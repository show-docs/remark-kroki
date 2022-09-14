import { getValue, parse } from 'markdown-code-block-meta';

import { fetchData, toDataURL } from './utils.mjs';

/* eslint-disable no-param-reassign */

const modes = {
  'base64-img': ({ node, diagramType, data, alt }) => {
    node.type = 'paragraph';
    node.children = [
      {
        type: 'image',
        alt: alt || diagramType,
        url: toDataURL(data),
      },
    ];
  },
  'base64-object': ({ node, diagramType, data, alt }) => {
    node.type = 'html';
    node.value = `<object type="image/svg+xml" class="kroki-object" data-type="${diagramType}" data-alt="${alt}" data=${toDataURL(
      data,
    )}></object>`;
  },
  'inline-svg': ({ node, diagramType, data, alt }) => {
    node.type = 'html';
    node.value = `<div class="kroki-wrapper" data-type="${diagramType}" data-alt="${alt}">${data.toString()}</div>`;
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
