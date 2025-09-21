import { getValue, parse } from 'markdown-code-block-meta';

import { create } from './ast.mjs';
import { fetchData, mime, toDataURL } from './utils.mjs';
import { getDiagramConfig } from './diagram-configs.mjs';

/* eslint-disable no-param-reassign */

function removeXML(string) {
  return string.replace(/<\?xml.+\?>/, '');
}

function extractDiagramOptions(object, diagramType) {
  // Keys that are used by remark-kroki and should not be passed to Kroki
  const remarkKrokiMetaOptions = ['alt', 'type', 'classnames'];

  // Get configuration for this diagram type
  const diagramConfig = getDiagramConfig(diagramType);

  // If no configuration found, log warning and return empty options
  if (!diagramConfig) {
    console.warn(`Unknown diagram type: ${diagramType}. No options will be extracted.`);
    return {};
  }

  const diagramOptions = {};
  const errors = [];

  for (const [key, val] of object) {
    // Process only non-remark-kroki options
    if (!remarkKrokiMetaOptions.includes(key.toLowerCase())) {
      // Parse the value using the getValue helper
      const parsedVal = getValue(val);

      // Process only if value exists
      if (parsedVal !== null && parsedVal !== undefined && parsedVal !== '') {
        // Normalize key to lowercase for case-insensitive matching
        const normalizedKey = key.toLowerCase();

        // Check if this option is supported for the diagram type
        let optionConfig = diagramConfig.options[normalizedKey];

        // If not found in exact options, check prefix options
        if (!optionConfig && diagramConfig.prefixOptions) {
          // Find matching prefix
          for (const [prefix, config] of Object.entries(diagramConfig.prefixOptions)) {
            if (normalizedKey.startsWith(prefix)) {
              optionConfig = config;
              break;
            }
          }
        }

        if (optionConfig) {
          // Validate the value
          try {
            if (optionConfig.validator(parsedVal)) {
              // Use the normalized key for consistency
              diagramOptions[normalizedKey] = parsedVal;
            } else {
              errors.push(`Invalid value for option '${key}': ${parsedVal}`);
            }
          } catch (error) {
            errors.push(`Error validating option '${key}': ${error.message}`);
          }
        } else {
          // Option not recognized for this diagram type
          console.warn(`Option '${key}' is not supported for diagram type '${diagramType}'`);
        }
      }
    }
  }

  // Log any validation errors
  if (errors.length > 0) {
    console.error(`Diagram option validation errors:\n${errors.join('\n')}`);
  }

  return diagramOptions;
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
  'object-base64': ({ target, diagramType, data, alt, classnames }) => {
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
          value: classnames ? `kroki-object ${classnames}` : 'kroki-object',
        },
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
  'img-html-base64': ({ target, diagramType, data, alt, classnames }) => {
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
              value: classnames ? `kroki-image ${classnames}` : 'kroki-image',
            },
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
  const classnames = getValue(object.get('classnames'));

  const diagramType = lang === 'kroki' ? type : lang;
  const diagramOptions = extractDiagramOptions(object, diagramType);
  headers['Content-Type'] = 'application/json';

  const data = await fetchData({
    server,
    headers,
    type: diagramType,
    diagram_source: value,
    diagram_options: diagramOptions,
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
      classnames,
    }),
  );
}
