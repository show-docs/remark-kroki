import { remark } from 'remark';
import remarkMdx from 'remark-mdx';
import { removePosition } from 'unist-util-remove-position';

import { remarkKroki } from '../../lib/index.mjs';
import type { ExecutionContext } from 'ava';

import type { Node } from 'unist';

function removePST(ast: Node) {
  removePosition(ast, { force: true });

  return ast.children;
}

export async function transform(input: string, option = {}) {
  const instance = remark().use(remarkKroki, option);

  const ast = instance.parse(input);

  return {
    output: await instance
      .process(input)
      .then((file) => file.toString().trim()),
    tree: removePST(await instance.run(ast)),
    ast: removePST(ast),
  };
}

export async function TransformSnapshot(
  t: ExecutionContext,
  input: string,
  option = {},
  slice = false,
) {
  const instance = remark().use(remarkMdx).use(remarkKroki, option);

  const ast = instance.parse(input);

  t.snapshot(input, 'input');
  t.snapshot(removePST(ast), 'ast');

  const tree = removePST(await instance.run(ast));

  t.snapshot(tree, 'parsed');

  const output = await instance
    .process(input)
    .then((file) => file.toString().trim())
    .then((text) => (slice ? text.slice(0, 4000) : text));

  t.snapshot(output, 'result');
}
