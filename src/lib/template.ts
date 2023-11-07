import { handleScript, handleStyle } from "./eh";
import { isHTMLElement, isTaggedHTMLElement } from "./element";
import { TEMPLATE_ATTR, tokenize } from "./attr";

export function handleTemplateAttr(element: HTMLElement) {
  const attr = element.getAttribute(TEMPLATE_ATTR);
  if (attr === null) return;

  const idSet = new Set(tokenize(attr));
  for (const id of idSet) {
    const template = document.querySelector<HTMLTemplateElement>(
      `template#${id}`
    );
    if (template === null) continue;

    for (const child of template.content.childNodes) {
      if (isHTMLElement(child)) {
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
