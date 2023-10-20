import { isElement, isHTMLElement, newId } from "./utils";
import { ID } from "./eh-attrs";

const replaceRgx = /&/g;

export const observer = new MutationObserver((mutationList) => {
  for (const { target } of mutationList) {
    if (isHTMLElement(target, "STYLE")) {
      const parent = target.parentNode;

      if (parent && isElement(parent) && !isHTMLElement(parent, "HEAD")) {
        let parentEhId = parent.getAttribute(ID);
        if (parentEhId === null) {
          parentEhId = newId().toString();
          parent.setAttribute(ID, parentEhId);
        }

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
