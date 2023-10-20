import { ID } from "./eh-attrs";

export function counter(initialCount = 0) {
  let count = initialCount;
  return () => count++;
}

const newId = counter();

export function getEhId(element: HTMLElement) {
  let id = element.getAttribute(ID);
  if (id === null) {
    id = newId().toString();
    element.setAttribute(ID, id);
  }

  return id;
}

export function isHTMLElement<K extends Uppercase<keyof HTMLElementTagNameMap>>(
  node: Node,
  tag: K
): node is HTMLElementTagNameMap[Lowercase<K>] {
  return node.nodeName === tag;
}
