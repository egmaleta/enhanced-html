import { isElement, isHTMLElement, newParentId, store } from "./common";

const replaceRgx = /&/g;

export const observer = new MutationObserver((mutationList) => {
  for (const { target } of mutationList) {
    if (isHTMLElement(target, "STYLE")) {
      const parent = target.parentNode;

      if (parent && isElement(parent) && !isHTMLElement(parent, "HEAD")) {
        let parentId = store.keyOf(parent);
        if (typeof parentId === "undefined") {
          parentId = newParentId();
          store.set(parentId, parent);
        }

        const attrName = `eh_${parentId}`;
        if (!parent.hasAttribute(attrName)) {
          parent.setAttribute(attrName, "");
        }

        const styleText = target.firstChild as Text;
        styleText.data = styleText.data.replace(replaceRgx, `[${attrName}]`);
      }
    }
  }
});

observer.observe(document, {
  subtree: true,
  childList: true,
});
