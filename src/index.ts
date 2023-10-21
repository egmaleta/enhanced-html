import { EH_SKIP_ATTR, ehElements as elements } from "./common";
import { handle as handleScript, propsCache as props } from "./script";
import { handle as handleStyle } from "./style";
import { isElement, isHTMLElement } from "./utils";

const observer = new MutationObserver((mutations) => {
  for (const { addedNodes } of mutations) {
    for (const node of addedNodes) {
      if (!isElement(node) || node.hasAttribute(EH_SKIP_ATTR)) continue;

      if (isHTMLElement(node, "SCRIPT")) {
        handleScript(node);
      } else if (isHTMLElement(node, "STYLE")) {
        handleStyle(node);
      }
    }
  }
});

observer.observe(document, {
  subtree: true,
  childList: true,
});

export { elements, props, observer };
