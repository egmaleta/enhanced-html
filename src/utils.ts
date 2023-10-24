import attrs from "./attrs";

export function isHTMLElement(node: Node): node is HTMLElement {
  return node.nodeType === Node.ELEMENT_NODE;
}

export function isTaggedHTMLElement<
  T extends Uppercase<keyof HTMLElementTagNameMap>
>(node: Node, tag: T): node is HTMLElementTagNameMap[Lowercase<T>] {
  return node.nodeName === tag;
}

const newKey = (function () {
  let count = 0;
  return () => count++;
})();

export function keyOf(element: HTMLElement) {
  let key = element.getAttribute(attrs.KEY);
  if (key === null) {
    key = newKey().toString();
    element.setAttribute(attrs.KEY, key);
  }

  return key;
}
