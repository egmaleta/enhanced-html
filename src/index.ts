import { ehElements } from "./common";
import { handleScript, propsCache as props } from "./script";
import { handle as handleStyle } from "./style";
import { isHTMLElement } from "./utils";

const EH_ATTR = "eh";
const EH_TEMPL_ATTR = "eh-templ";

const splitRgx = /\s+/;

const observer = new MutationObserver((mutations) => {
  for (const { target, addedNodes } of mutations) {
    if (!isHTMLElement(target)) continue;

    for (const node of addedNodes) {
      if (!isHTMLElement(node)) continue;

      const hasEhAttr = node.hasAttribute(EH_ATTR);

      if (node.nodeName === "SCRIPT" && hasEhAttr) {
        handleScript(node, target);
      } else if (node.nodeName === "STYLE" && hasEhAttr) {
        handleStyle(node, target);
      } else {
        const ids = node.getAttribute(EH_TEMPL_ATTR);
        if (ids !== null) {
          for (const id of new Set(ids.trim().split(splitRgx))) {
            const template: HTMLTemplateElement | null = document.querySelector(
              `template#${id}`
            );
            if (template) {
              for (const child of template.content.childNodes) {
                // script elements do not work by simply appending them
                // so they need to be handled manually
                if (
                  isHTMLElement(child) &&
                  child.nodeName === "SCRIPT" &&
                  child.hasAttribute(EH_ATTR)
                ) {
                  const script = document.createElement("script");
                  handleScript(script, node, {
                    templateId: id,
                    templateElement: child,
                  });
                  node.appendChild(script);
                } else {
                  node.appendChild(child.cloneNode(true));
                }
              }
            }
          }

          node.removeAttribute(EH_TEMPL_ATTR);
        }
      }

      hasEhAttr && node.removeAttribute(EH_ATTR);
    }
  }
});

observer.observe(document, {
  subtree: true,
  childList: true,
});

export { ehElements as elements, props, observer };
