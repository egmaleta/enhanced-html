import attrs from "./attrs";
import { handle as handleScript } from "./script";
import { handle as handleStyle } from "./style";
import { isHTMLElement, isTaggedHTMLElement } from "./utils";

const splitRgx = /\s+/;

export function handle(element: HTMLElement) {
  const ids = element.getAttribute(attrs.TEMPLATE);
  if (ids === null) return;

  for (const id of new Set(ids.trim().split(splitRgx))) {
    const template = document.querySelector<HTMLTemplateElement>(
      `template#${id}`
    );
    if (!template) continue;

    for (const child of template.content.childNodes) {
      if (isHTMLElement(child) && child.hasAttribute(attrs.EH)) {
        const isScript = isTaggedHTMLElement(child, "SCRIPT");
        if (isScript || isTaggedHTMLElement(child, "STYLE")) {
          isScript
            ? handleScript(element, child, id)
            : handleStyle(element, child, id);
          continue;
        }
      }

      element.appendChild(child.cloneNode(true));
    }
  }
}
