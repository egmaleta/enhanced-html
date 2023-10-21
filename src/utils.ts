export function newCounter() {
  let count = 0;
  return () => count++;
}

export function isElement(node: Node): node is Element {
  return node.nodeType === Node.ELEMENT_NODE;
}

export function isHTMLElement<K extends Uppercase<keyof HTMLElementTagNameMap>>(
  node: Node,
  tag: K
): node is HTMLElementTagNameMap[Lowercase<K>] {
  return node.nodeName === tag;
}
