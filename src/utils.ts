export function counter(initialCount = 0) {
  let count = initialCount;
  return () => count++;
}

export function isHTMLElement<K extends Uppercase<keyof HTMLElementTagNameMap>>(
  node: Node,
  tag: K
): node is HTMLElementTagNameMap[Lowercase<K>] {
  return node.nodeName === tag;
}

export class TwoWayMap<K, V> {
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
