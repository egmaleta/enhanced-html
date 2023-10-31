import { handle as handleTemplateAttr } from "./attr/template";
import { handle as handleScript } from "./script";
import { handle as handleStyle } from "./style";
import { isHTMLElement, isTaggedHTMLElement } from "./element";

export function handle(element: HTMLElement) {
  const idList = handleTemplateAttr(element);

  for (const id of idList) {
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
