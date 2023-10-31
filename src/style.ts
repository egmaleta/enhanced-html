import { FOR_ATTR, FROM_TEMPLATE_ATTR, TEMPLATE_ATTR } from "./attr/names";
import { selectorByKey } from "./attr/utils";
import { SELF_SELECTOR, keyOf } from "./element";

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
    style.setAttribute(FOR_ATTR, key);
    style.textContent = sourceStyle.textContent.replace(
      SELF_SELECTOR,
      selectorByKey(key)
    );
    head.appendChild(style);
  } else {
    if (!head.querySelector(`style[${FROM_TEMPLATE_ATTR}="${asTemplate}"]`)) {
      const style = document.createElement("style");
      style.setAttribute(FROM_TEMPLATE_ATTR, asTemplate);
      style.textContent = sourceStyle.textContent.replace(
        SELF_SELECTOR,
        `[${TEMPLATE_ATTR}~="${asTemplate}"]`
      );
      head.appendChild(style);
    }
  }
}
