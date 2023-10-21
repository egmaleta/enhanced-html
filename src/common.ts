import { counter } from "./utils";

export const EH_SKIP_ATTR = "eh-skip";

const newKey = counter();

class EhElementManager {
  private normal = new Map<number, HTMLElement>();
  private reversed = new Map<HTMLElement, number>();
  get(key: number) {
    return this.normal.get(key);
  }
  keyOf(value: HTMLElement) {
    return this.reversed.get(value);
  }
  register(value: HTMLElement) {
    const key = newKey();

    this.normal.set(key, value);
    this.reversed.set(value, key);

    return key;
  }
}

export const ehElements = new EhElementManager();
