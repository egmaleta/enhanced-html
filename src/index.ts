import { EH_ATTR, REQUEST_ATTR, TEMPLATE_ATTR } from "./attr/names";
import { handle as handleWithReqAttr } from "./request";
import { handle as handleScript } from "./script";
import { handle as handleStyle } from "./style";
import { handle as handleTemplate } from "./template";
import { isHTMLElement, isTaggedHTMLElement } from "./element";

const observer = new MutationObserver((mutations) => {
  for (const { target, addedNodes } of mutations) {
    if (!isHTMLElement(target)) continue;

    for (const node of addedNodes) {
      if (!isHTMLElement(node)) continue;

      if (node.hasAttribute(EH_ATTR)) {
        node.removeAttribute(EH_ATTR);

        const isScript = isTaggedHTMLElement(node, "SCRIPT");
        if (isScript || isTaggedHTMLElement(node, "STYLE")) {
          isScript ? handleScript(target, node) : handleStyle(target, node);
          target.removeChild(node);
          continue;
        }
      }

      if (node.hasAttribute(TEMPLATE_ATTR)) {
        handleTemplate(node);
      }

      if (node.hasAttribute(REQUEST_ATTR)) {
        handleWithReqAttr(node);
      }
    }
  }
});

observer.observe(document, {
  subtree: true,
  childList: true,
});

export { observer };
