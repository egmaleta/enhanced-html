export function newCounter() {
  let count = 0;
  return () => count++;
}

export function isHTMLElement(node: Node): node is HTMLElement {
  return node.nodeType === Node.ELEMENT_NODE;
}
