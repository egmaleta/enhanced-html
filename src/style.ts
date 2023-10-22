import { FROMTEMPL_ATTR, STYLED_ATTR } from "./attrs";
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
    style.textContent = sourceStyle.textContent.replace(
      replaceRgx,
      `[${STYLED_ATTR}="${key}"]`
    );
    head.appendChild(style);
    element.setAttribute(STYLED_ATTR, `${key}`);
  } else {
    if (!head.querySelector(`style[${FROMTEMPL_ATTR}="${asTemplate}"]`)) {
      const style = document.createElement("style");
      style.setAttribute(FROMTEMPL_ATTR, asTemplate);
      style.textContent = sourceStyle.textContent.replace(
        replaceRgx,
        `[${STYLED_ATTR}="${asTemplate}"]`
      );
      head.appendChild(style);
    }

    element.setAttribute(STYLED_ATTR, asTemplate);
  }
}
