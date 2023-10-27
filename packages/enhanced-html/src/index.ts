import attrs from "./attrs";
import { handle as handleScript } from "./script";
import { handle as handleStyle } from "./style";
import { handle as handleTemplate } from "./template";
import { isHTMLElement, isTaggedHTMLElement } from "./utils";

const observer = new MutationObserver((mutations) => {
  for (const { target, addedNodes } of mutations) {
    if (!isHTMLElement(target)) continue;

    for (const node of addedNodes) {
      if (!isHTMLElement(node)) continue;

      if (node.hasAttribute(attrs.EH)) {
        node.removeAttribute(attrs.EH);

        const isScript = isTaggedHTMLElement(node, "SCRIPT");
        if (isScript || isTaggedHTMLElement(node, "STYLE")) {
          isScript ? handleScript(target, node) : handleStyle(target, node);
          target.removeChild(node);
          continue;
        }
      }

      if (node.hasAttribute(attrs.TEMPLATE)) {
        handleTemplate(node);
      }
    }
  }
});

observer.observe(document, {
  subtree: true,
  childList: true,
});

export { observer };
