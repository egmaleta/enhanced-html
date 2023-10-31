import { KEY_ATTR } from "./attr/names";

export function isHTMLElement(node: Node): node is HTMLElement {
  return node.nodeType === Node.ELEMENT_NODE;
}

export function isTaggedHTMLElement<
  T extends Uppercase<keyof HTMLElementTagNameMap>
>(node: Node, tag: T): node is HTMLElementTagNameMap[Lowercase<T>] {
  return node.nodeName === tag;
}

const newKey = (function () {
  const varName = "eh$keycount";
  if (!(varName in window)) {
    Object.defineProperty(window, varName, { value: 0, writable: true });
  }
  // @ts-ignore
  return () => window[varName]++;
})();

export function keyOf(element: HTMLElement) {
  let key = element.getAttribute(KEY_ATTR);
  if (key === null) {
    key = newKey().toString();
    element.setAttribute(KEY_ATTR, key);
  }

  return key;
}

export const SELF_SELECTOR = /&/g;
