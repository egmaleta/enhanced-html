import attrs from "./attrs";
import { ehElements } from "./common";
import { handle as handleScript } from "./script";
import { handle as handleStyle } from "./style";
import { isHTMLElement, isTaggedHTMLElement } from "./utils";

const splitRgx = /\s+/;

const observer = new MutationObserver((mutations) => {
  for (const { target, addedNodes } of mutations) {
    if (!isHTMLElement(target)) continue;

    for (const node of addedNodes) {
      if (!isHTMLElement(node)) continue;

      const hasEhAttr = node.hasAttribute(attrs.EH);

      if (isTaggedHTMLElement(node, "SCRIPT") && hasEhAttr) {
        handleScript(target, node);
        target.removeChild(node);
      } else if (isTaggedHTMLElement(node, "STYLE") && hasEhAttr) {
        handleStyle(target, node);
        target.removeChild(node);
      } else {
        const ids = node.getAttribute(attrs.TEMPLATE);
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
                  isTaggedHTMLElement(child, "SCRIPT") &&
                  child.hasAttribute(attrs.EH)
                ) {
                  handleScript(node, child, id);
                } else if (
                  isTaggedHTMLElement(child, "STYLE") &&
                  child.hasAttribute(attrs.EH)
                ) {
                  handleStyle(node, child, id);
                } else {
                  node.appendChild(child.cloneNode(true));
                }
              }
            }
          }
        }
      }

      hasEhAttr && node.removeAttribute(attrs.EH);
    }
  }
});

observer.observe(document, {
  subtree: true,
  childList: true,
});

export { ehElements as elements, observer };
