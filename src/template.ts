import { TEMPLATE_ATTR } from "./attr/names";
import { handle as handleScript } from "./script";
import { handle as handleStyle } from "./style";
import { isHTMLElement, isTaggedHTMLElement } from "./element";
import { tokenizeAttr } from "./attr/utils";

export function handle(element: HTMLElement) {
  const ids = element.getAttribute(TEMPLATE_ATTR);
  if (ids === null) return;

  for (const id of new Set(tokenizeAttr(ids))) {
    const template = document.querySelector<HTMLTemplateElement>(
      `template#${id}`
    );
    if (!template) continue;

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
