import { REQUEST_ATTR } from "./attrs";
import { handle as handleRequestAttr } from "./request";
import { isHTMLElement } from "./utils";

export const observer = new MutationObserver((mutations) => {
  for (const { target, addedNodes } of mutations) {
    if (isHTMLElement(target)) {
      for (const node of addedNodes) {
        if (isHTMLElement(node) && node.hasAttribute(REQUEST_ATTR)) {
          handleRequestAttr(node);
        }
      }
    }
  }
});

observer.observe(document, {
  subtree: true,
  childList: true,
});
