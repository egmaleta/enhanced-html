import type { RequestContextData } from "./types";

export function isElement(node: Node): node is Element {
  return node.nodeType === Node.ELEMENT_NODE;
}

export function isHTMLElement<T extends Uppercase<keyof HTMLElementTagNameMap>>(
  node: Node,
  tag: T
): node is HTMLElementTagNameMap[Lowercase<T>] {
  return node.nodeName === tag;
}

const newKey = (function () {
  let count = 0;
  return () => count++;
})();

export const store = {
  _elementToTuple: new Map<
    Element,
    [number, object, Partial<RequestContextData>]
  >(),
  _keyToElement: new Map<number, Element>(),

  keyOf(element: Element) {
    return this._elementToTuple.get(element)?.[0];
  },
  propsOf(element: Element) {
    return this._elementToTuple.get(element)?.[1];
  },
  dataOf(element: Element) {
    return this._elementToTuple.get(element)?.[2];
  },

  get(key: number) {
    return this._keyToElement.get(key);
  },

  has(element: Element) {
    return this._elementToTuple.has(element);
  },

  register(element: Element) {
    if (!this.has(element)) {
      const key = newKey();
      this._elementToTuple.set(element, [key, {}, {}]);
      this._keyToElement.set(key, element);
    }
  },
};

export function getInheritedData(
  element: Element
): Partial<RequestContextData> {
  const ancestorDataList: Partial<RequestContextData>[] = [];
  for (
    let parent = element.parentElement;
    parent !== null && parent !== document.documentElement;
    parent = parent.parentElement
  ) {
    if (store.has(parent)) {
      ancestorDataList.unshift(store.dataOf(parent)!);
    }
  }

  return Object.assign({}, ...ancestorDataList);
}
