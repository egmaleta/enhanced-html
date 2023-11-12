import { handleScript, handleStyle } from "./eh";
import { isElement, isHTMLElement } from "./element";
import { TEMPLATE_ATTR, tokenize } from "./attr";

export function handleTemplateAttr(element: Element) {
  const attr = element.getAttribute(TEMPLATE_ATTR);
  if (attr === null) return;

  const idSet = new Set(tokenize(attr));
  for (const id of idSet) {
    const template = document.querySelector<HTMLTemplateElement>(
      `template#${id}`
    );
    if (template === null) continue;

    for (const child of template.content.childNodes) {
      if (isElement(child)) {
        const isScript = isHTMLElement(child, "SCRIPT");
        if (isScript || isHTMLElement(child, "STYLE")) {
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
