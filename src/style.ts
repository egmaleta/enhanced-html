import { getEhId } from "./utils";
import { ID } from "./eh-attrs";

const replaceRgx = /&/g;

export const observer = new MutationObserver((mutationList) => {
  for (const { target } of mutationList) {
    if (target.nodeName === "STYLE") {
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
