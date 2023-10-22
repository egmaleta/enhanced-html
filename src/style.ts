import { FOR_ATTR, FROMTEMPL_ATTR, KEY_ATTR, TEMPL_ATTR } from "./attrs";
import { ehElements } from "./common";

const replaceRgx = /&/g;

export function handle(
  element: HTMLElement,
  sourceStyle: HTMLStyleElement,
  asTemplate: string | false = false
) {
  if (sourceStyle.textContent === null) return;

  let key = ehElements.keyOf(element);
  if (typeof key === "undefined") {
    key = ehElements.register(element);
  }

  const head = document.head;

  if (asTemplate === false) {
    const style = document.createElement("style");
    style.setAttribute(FOR_ATTR, `${key}`);
    style.textContent = sourceStyle.textContent.replace(
      replaceRgx,
      `[${KEY_ATTR}="${key}"]`
    );
    head.appendChild(style);
  } else {
    if (!head.querySelector(`style[${FROMTEMPL_ATTR}="${asTemplate}"]`)) {
      const style = document.createElement("style");
      style.setAttribute(FROMTEMPL_ATTR, asTemplate);
      style.textContent = sourceStyle.textContent.replace(
        replaceRgx,
        `[${TEMPL_ATTR}~="${asTemplate}"]`
      );
      head.appendChild(style);
    }
  }
}
