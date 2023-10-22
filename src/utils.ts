export function isHTMLElement(node: Node): node is HTMLElement {
  return node.nodeType === Node.ELEMENT_NODE;
}

export function isTaggedHTMLElement<
  T extends Uppercase<keyof HTMLElementTagNameMap>
>(node: Node, tag: T): node is HTMLElementTagNameMap[Lowercase<T>] {
  return node.nodeName === tag;
}
