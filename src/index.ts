import { EH_ATTR } from "./lib/attr";
import { handleEhAttr } from "./lib/eh";
import { isElement, isHTMLElement, store } from "./lib/element";
import { handlePropsAttr } from "./lib/props";
import { handleRequestAttr } from "./lib/request";
import { handleResponseAttr } from "./lib/response";
import { handleTemplateAttr } from "./lib/template";
import { handleTriggerAttr } from "./lib/trigger";

function shouldRegister(element: Element) {
  for (const { name } of element.attributes) {
    if (name.startsWith("eh-") || name === EH_ATTR) {
      return true;
    }
  }

  return false;
}

const observer = new MutationObserver((mutations) => {
  for (const { target, addedNodes } of mutations) {
    if (!isElement(target)) continue;

    for (const node of addedNodes) {
      if (!isElement(node)) continue;

      if (isHTMLElement(node, "SCRIPT") || isHTMLElement(node, "STYLE")) {
        // eh attr is the last attr to handle because
        // the handling occurs when the element is the
        // target in a mutation
        //
        // the rest of the attrs are handled when the
        // element is added
        handleEhAttr(target, node);
        continue;
      }

      if (shouldRegister(node)) {
        store.register(node);

        handlePropsAttr(node);
        handleTemplateAttr(node);
        handleTriggerAttr(node);
        handleResponseAttr(node);

        handleRequestAttr(node);
      }
    }
  }
});

observer.observe(document, {
  subtree: true,
  childList: true,
});

export { store, observer };
