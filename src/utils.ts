export function counter() {
  let count = 0;
  return () => count++;
}

export function isHTMLElement<K extends Uppercase<keyof HTMLElementTagNameMap>>(
  node: Node,
  tag: K
): node is HTMLElementTagNameMap[Lowercase<K>] {
  return node.nodeName === tag;
}
