import { EH_SKIP_ATTR, ehElements } from "./common";
import { isHTMLElement } from "./utils";

const EH_KEY_ATTR = "eh-key";

const replaceRgx = /&/g;

export const observer = new MutationObserver((mutations) => {
  for (const { target } of mutations) {
    if (isHTMLElement(target, "STYLE") && !target.hasAttribute(EH_SKIP_ATTR)) {
      const parent = target.parentElement;

      if (parent && parent.nodeName !== "HEAD") {
        let key = ehElements.keyOf(parent);
        if (typeof key === "undefined") {
          key = ehElements.register(parent);
        }

        if (!parent.hasAttribute(EH_KEY_ATTR)) {
          parent.setAttribute(EH_KEY_ATTR, `${key}`);
        }

        const selector = `[${EH_KEY_ATTR}="${key}"]`;
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
