function attrString(attributes = []) {
  return attributes.length > 0
    ? attributes
        .map(
          ({ name, value }) =>
            ` ${name === 'className' ? 'class' : name}="${value}"`,
        )
        .join('')
    : '';
}

export function create(target, ast) {
  if (target === 'mdx3') {
    return ast;
  }

  const { name, attributes, children: [{ value: child } = {}] = [] } = ast;

  return {
    type: target,
    value: child
      ? [`<${name}${attrString(attributes)}>`, child, `</${name}>`].join('')
      : `<${name}${attrString(attributes)} />`,
  };
}
