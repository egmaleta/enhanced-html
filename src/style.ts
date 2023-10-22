import { ehElements } from "./common";

const EH_KEY_ATTR = "eh-key";

const replaceRgx = /&/g;

export function handle(element: HTMLElement, parent: HTMLElement) {
  if (element.textContent !== null) {
    let key = ehElements.keyOf(parent);
    if (typeof key === "undefined") {
      key = ehElements.register(parent);
    }

    if (!parent.hasAttribute(EH_KEY_ATTR)) {
      parent.setAttribute(EH_KEY_ATTR, `${key}`);
    }

    const selector = `[${EH_KEY_ATTR}="${key}"]`;
    element.textContent = element.textContent.replace(replaceRgx, selector);
  }
}
