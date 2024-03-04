import { getValue, parse } from 'markdown-code-block-meta';

import { create } from './ast.mjs';
import { fetchData, mime, toDataURL } from './utils.mjs';

/* eslint-disable no-param-reassign */

function removeXML(string) {
  return string.replace(/<\?xml.+\?>/, '');
}

function styleAst(width) {
  return {
    type: 'mdxJsxAttributeValueExpression',
    value: `{ minWidth: '${width}' }`,
    data: {
      estree: {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'ObjectExpression',
              properties: [
                {
                  type: 'Property',
                  method: false,
                  shorthand: false,
                  computed: false,
                  key: {
                    type: 'Identifier',
                    name: 'midWidth',
                  },
                  value: {
                    type: 'Literal',
                    value: width,
                    raw: `'${width}'`,
                  },
                  kind: 'init',
                },
              ],
            },
          },
        ],
      },
    },
  };
}

const modes = {
  'img-base64': ({ diagramType, data, alt }) => {
    return {
      type: 'paragraph',
      children: [
        {
          type: 'image',
          _meta: { kroki: true, type: diagramType },
          alt: alt || diagramType,
          url: toDataURL(data),
        },
      ],
    };
  },
  'object-base64': ({ target, diagramType, data, alt, width }) => {
    return create(target, {
      type: 'mdxJsxFlowElement',
      name: 'object',
      children: [
        {
          type: 'text',
          value: 'Load SVG fail...',
        },
      ],
      attributes: [
        {
          type: 'mdxJsxAttribute',
          name: 'type',
          value: mime,
        },
        {
          type: 'mdxJsxAttribute',
          name: 'className',
          value: 'kroki-object',
        },
        width
          ? {
              type: 'mdxJsxAttribute',
              name: 'style',
              value: styleAst(width),
            }
          : undefined,
        {
          type: 'mdxJsxAttribute',
          name: 'data-type',
          value: diagramType,
        },
        {
          type: 'mdxJsxAttribute',
          name: 'title',
          value: alt || diagramType,
        },
        {
          type: 'mdxJsxAttribute',
          name: 'data',
          value: toDataURL(data),
        },
      ].filter(Boolean),
    });
  },
  'img-html-base64': ({ target, diagramType, data, alt, width }) => {
    return {
      type: 'paragraph',
      children: [
        create(target, {
          type: 'mdxJsxTextElement',
          name: 'img',
          attributes: [
            {
              type: 'mdxJsxAttribute',
              name: 'className',
              value: 'kroki-image',
            },
            width
              ? {
                  type: 'mdxJsxAttribute',
                  name: 'style',
                  value: styleAst(width),
                }
              : undefined,
            {
              type: 'mdxJsxAttribute',
              name: 'alt',
              value: alt || diagramType,
            },
            {
              type: 'mdxJsxAttribute',
              name: 'data-type',
              value: diagramType,
            },
            {
              type: 'mdxJsxAttribute',
              name: 'src',
              value: toDataURL(data),
            },
          ],
        }),
      ],
    };
  },
  'inline-svg': ({ target, diagramType, data, alt }) => {
    return create(target, {
      type: 'mdxJsxFlowElement',
      name: 'p',
      attributes: [
        {
          type: 'mdxJsxAttribute',
          name: 'className',
          value: 'kroki-inline-svg',
        },
        {
          type: 'mdxJsxAttribute',
          name: 'data-type',
          value: diagramType,
        },
        {
          type: 'mdxJsxAttribute',
          name: 'data-alt',
          value: alt || diagramType,
        },
      ],
      children: [
        {
          type: 'html',
          value: removeXML(data.toString()),
        },
      ],
    });
  },
};

export const outputType = Object.keys(modes);

export async function transform({ node, server, headers, output, target }) {
  const { meta, value, lang } = node;

  const object = parse(meta);

  const alt = getValue(object.get('alt'));
  const type = getValue(object.get('type'));
  const width = getValue(object.get('width'));

  const diagramType = lang === 'kroki' ? type : lang;

  const data = await fetchData({
    server,
    headers,
    type: diagramType,
    value,
  });

  for (const key of Object.keys(node)) {
    delete node[key];
  }

  Object.assign(
    node,
    modes[output]({
      diagramType,
      data,
      alt,
      target,
      width,
    }),
  );
}
