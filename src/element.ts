type ElementData = {
  key: number;
  props?: object | number | string | boolean | null;
};

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

export const store = {
  _elementToData: new Map<Element, ElementData>(),
  _keyToElement: new Map<number, Element>(),

  get(key: number) {
    return this._keyToElement.get(key);
  },

  dataOf(element: Element) {
    return this._elementToData.get(element);
  },

  register(element: Element): ElementData {
    if (!this._elementToData.has(element)) {
      const data = { key: newKey() };
      this._elementToData.set(element, data);
      this._keyToElement.set(data.key, element);

      return data;
    }

    return this.dataOf(element)!;
  },
};

export const storeVarName = "eh$elements";
if (!(storeVarName in window)) {
  Object.defineProperty(window, storeVarName, { value: store });
}
