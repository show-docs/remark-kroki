import remark from 'remark';

import Plugin from '../../lib/index.cjs';

export function transform(input, option = {}) {
  return remark()
    .use(Plugin, option)
    .process(input)
    .then((file) => file.toString());
}

export function getUtils(t) {
  return {
    sameText(actul, expected) {
      t.is(actul.trim(), expected.trim());
    },
  };
}
