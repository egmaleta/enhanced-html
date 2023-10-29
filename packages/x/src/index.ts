import { REQUEST_ATTR } from "./attrs";
import { handle } from "./request";
import { isHTMLElement } from "./utils";

export const observer = new MutationObserver((mutations) => {
  for (const { target, addedNodes } of mutations) {
    if (isHTMLElement(target)) {
      for (const node of addedNodes) {
        if (isHTMLElement(node) && node.hasAttribute(REQUEST_ATTR)) {
          handle(node);
        }
      }
    }
  }
});

observer.observe(document, {
  subtree: true,
  childList: true,
});
