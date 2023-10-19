export function counter(initialCount = 0) {
  let count = initialCount;
  return () => count++;
}

export const newParentId = counter();

export function isElement(node: Node): node is Element {
  return node.nodeType === Node.ELEMENT_NODE;
}

export function isHTMLElement<K extends Uppercase<keyof HTMLElementTagNameMap>>(
  node: Node,
  tag: K
): node is HTMLElementTagNameMap[Lowercase<K>] {
  return node.nodeName === tag;
}

class TwoWayMap<K, V> {
  private normal = new Map<K, V>();
  private reversed = new Map<V, K>();

  get(key: K) {
    return this.normal.get(key);
  }
  keyOf(value: V) {
    return this.reversed.get(value);
  }
  set(key: K, value: V) {
    this.normal.set(key, value);
    this.reversed.set(value, key);
  }
}

export const store = new TwoWayMap<number, Node>();
