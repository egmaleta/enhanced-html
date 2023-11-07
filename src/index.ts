import { handleEhAttr } from "./lib/eh";
import { isHTMLElement, isTaggedHTMLElement, store } from "./lib/element";
import { handlePropsAttr } from "./lib/props";
import { handleRequestAttr } from "./lib/request";
import { handleResponseAttr } from "./lib/response";
import { handleTemplateAttr } from "./lib/template";
import { handleTriggerAttr } from "./lib/trigger";

function shouldRegister(element: Element) {
  for (const { name } of element.attributes) {
    if (name.startsWith("eh-")) {
      return true;
    }
  }

  return false;
}

const observer = new MutationObserver((mutations) => {
  for (const { target, addedNodes } of mutations) {
    if (!isHTMLElement(target)) continue;

    for (const node of addedNodes) {
      if (!isHTMLElement(node)) continue;

      if (
        isTaggedHTMLElement(node, "SCRIPT") ||
        isTaggedHTMLElement(node, "STYLE")
      ) {
        handleEhAttr(node);
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

export { observer };
