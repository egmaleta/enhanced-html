import { EH_FROMTEMPL_ATTR, ehElements } from "./common";

const EH_STYLED_ATTR = "eh-styled";

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
      `[${EH_STYLED_ATTR}="${key}"]`
    );
    head.appendChild(style);
    element.setAttribute(EH_STYLED_ATTR, `${key}`);
  } else {
    if (!head.querySelector(`style[${EH_FROMTEMPL_ATTR}="${asTemplate}"]`)) {
      const style = document.createElement("style");
      style.setAttribute(EH_FROMTEMPL_ATTR, asTemplate);
      style.textContent = sourceStyle.textContent.replace(
        replaceRgx,
        `[${EH_STYLED_ATTR}="${asTemplate}"]`
      );
      head.appendChild(style);
    }

    element.setAttribute(EH_STYLED_ATTR, asTemplate);
  }
}
