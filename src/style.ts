import attrs from "./attrs";
import { keyOf } from "./utils";

const replaceRgx = /&/g;

export function handle(
  element: HTMLElement,
  sourceStyle: HTMLStyleElement,
  asTemplate: string | false = false
) {
  if (sourceStyle.textContent === null) return;

  const key = keyOf(element);

  const head = document.head;

  if (asTemplate === false) {
    const style = document.createElement("style");
    style.setAttribute(attrs.FOR, key);
    style.textContent = sourceStyle.textContent.replace(
      replaceRgx,
      `[${attrs.KEY}="${key}"]`
    );
    head.appendChild(style);
  } else {
    if (!head.querySelector(`style[${attrs.FROM_TEMPLATE}="${asTemplate}"]`)) {
      const style = document.createElement("style");
      style.setAttribute(attrs.FROM_TEMPLATE, asTemplate);
      style.textContent = sourceStyle.textContent.replace(
        replaceRgx,
        `[${attrs.TEMPLATE}~="${asTemplate}"]`
      );
      head.appendChild(style);
    }
  }
}
