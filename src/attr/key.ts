import { KEY_ATTR } from "./names";
import { isEmptyAttr } from "./utils";

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
