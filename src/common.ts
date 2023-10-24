import attrs from "./attrs";

const newKey = (function () {
  let count = 0;
  return () => count++;
})();

class EhElementManager {
  private normal = new Map<number, HTMLElement>();
  private reversed = new Map<HTMLElement, number>();
  get(key: number) {
    return this.normal.get(key);
  }
  keyOf(value: HTMLElement) {
    return this.reversed.get(value);
  }
  has(value: HTMLElement) {
    return this.reversed.has(value);
  }
  register(value: HTMLElement) {
    const key = newKey();

    this.normal.set(key, value);
    this.reversed.set(value, key);

    value.setAttribute(attrs.KEY, `${key}`);

    return key;
  }
}

export const ehElements = new EhElementManager();
