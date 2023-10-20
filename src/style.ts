import { newId } from "./utils";
import { ID } from "./eh-attrs";

const replaceRgx = /&/g;

export const observer = new MutationObserver((mutationList) => {
  for (const { target } of mutationList) {
    if (target.nodeName === "STYLE") {
      const parent = target.parentElement;

      if (parent && parent.nodeName !== "HEAD") {
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
