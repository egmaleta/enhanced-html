import { getEhId, isHTMLElement } from "./utils";
import { ID, SKIP } from "./eh-attrs";

const replaceRgx = /&/g;

export const observer = new MutationObserver((mutationList) => {
  for (const { target } of mutationList) {
    if (isHTMLElement(target, "STYLE") && !target.hasAttribute(SKIP)) {
      const parent = target.parentElement;

      if (parent && parent.nodeName !== "HEAD") {
        const parentEhId = getEhId(parent);
        const selector = `[${ID}="${parentEhId}"]`;

        const styleText = target.firstChild as Text;
        styleText.data = styleText.data.replace(replaceRgx, selector);
      }
    }
  }
});

observer.observe(document, {
  subtree: true,
  childList: true,
});
