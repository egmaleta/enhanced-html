import { EH_SKIP_ATTR, ehElements } from "./common";
import { handle as handleScript, propsCache as props } from "./script";
import { handle as handleStyle } from "./style";
import { isHTMLElement } from "./utils";

const observer = new MutationObserver((mutations) => {
  for (const { target, addedNodes } of mutations) {
    if (!isHTMLElement(target)) continue;

    for (const node of addedNodes) {
      if (!isHTMLElement(node) || node.hasAttribute(EH_SKIP_ATTR)) continue;

      if (node.nodeName === "SCRIPT") {
        handleScript(node, target);
      } else if (node.nodeName === "STYLE") {
        handleStyle(node, target);
      }
    }
  }
});

observer.observe(document, {
  subtree: true,
  childList: true,
});

export { ehElements as elements, props, observer };
