import { EH_SKIP_ATTR, ehElements } from "./common";
import { handle as handleScript, propsCache as props } from "./script";
import { handle as handleStyle } from "./style";
import { isHTMLElement } from "./utils";

const EH_TEMPLATE_ATTR = "eh-template";

const observer = new MutationObserver((mutations) => {
  for (const { target, addedNodes } of mutations) {
    if (!isHTMLElement(target)) continue;

    for (const node of addedNodes) {
      if (!isHTMLElement(node) || node.hasAttribute(EH_SKIP_ATTR)) continue;

      if (node.nodeName === "SCRIPT") {
        handleScript(node, target);
      } else if (node.nodeName === "STYLE") {
        handleStyle(node, target);
      } else {
        const id = node.getAttribute(EH_TEMPLATE_ATTR);
        if (id === null) continue;

        const template: HTMLTemplateElement | null = document.querySelector(
          `template#${id}`
        );
        if (!template) continue;

        for (const child of template.content.childNodes) {
          const clone = child.cloneNode(true);

          // script elements do not work by simply appending them
          // so they need to be handled manually
          if (isHTMLElement(clone) && clone.nodeName === "SCRIPT") {
            !ehElements.has(node) && ehElements.register(node);
            handleScript(clone, node);
            clone.setAttribute(EH_SKIP_ATTR, "");
          }

          node.appendChild(clone);
        }
      }
    }
  }
});

observer.observe(document, {
  subtree: true,
  childList: true,
});

export { ehElements as elements, props, observer };
