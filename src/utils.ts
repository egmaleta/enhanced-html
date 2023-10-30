import { KEY_ATTR } from "./attrs";

export function isHTMLElement(node: Node): node is HTMLElement {
  return node.nodeType === Node.ELEMENT_NODE;
}

export function isTaggedHTMLElement<
  T extends Uppercase<keyof HTMLElementTagNameMap>
>(node: Node, tag: T): node is HTMLElementTagNameMap[Lowercase<T>] {
  return node.nodeName === tag;
}

export function isEmptyAttr(attr: string | null): attr is null | "" {
  return attr === null || attr.length === 0;
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
  if (isEmptyAttr(key)) {
    key = newKey().toString();
    element.setAttribute(KEY_ATTR, key);
  }

  return key;
}

export function selectorByEhKey(key: string) {
  return `[${KEY_ATTR}="${key}"]`;
}

export const AMPERSAND = /&/g;

const EXTRA_SPACE = /\s+/;

export function tokenizeAttr(attr: string) {
  return attr.trim().split(EXTRA_SPACE);
}
