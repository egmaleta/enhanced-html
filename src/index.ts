import { EH_SKIP_ATTR, ehElements as elements } from "./common";
import { handle as handleScript, propsCache as props } from "./script";
import { handle as handleStyle } from "./style";
import { isHTMLElement } from "./utils";

const observer = new MutationObserver((mutations) => {
  for (const { target } of mutations) {
    if (isHTMLElement(target, "SCRIPT") && !target.hasAttribute(EH_SKIP_ATTR)) {
      handleScript(target);
    } else if (
      isHTMLElement(target, "STYLE") &&
      !target.hasAttribute(EH_SKIP_ATTR)
    ) {
      handleStyle(target);
    }
  }
});

observer.observe(document, {
  subtree: true,
  childList: true,
});

export { elements, props, observer };
