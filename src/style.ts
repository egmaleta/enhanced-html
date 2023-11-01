import { keyOf } from "./attr/key";
import { FOR_ATTR, FROM_TEMPLATE_ATTR } from "./attr/names";
import { selectorByKey } from "./selector";
import { SELF_SELECTOR, selectorByTemplateId } from "./selector";

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
        selectorByTemplateId(asTemplate)
      );
      head.appendChild(style);
    }
  }
}
