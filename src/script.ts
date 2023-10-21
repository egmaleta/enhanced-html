import { EH_SKIP_ATTR, ehElements } from "./common";
import { newCounter, isHTMLElement } from "./utils";

const counterMap = new Map<number, ReturnType<typeof newCounter>>();
const replaceRgx = /\$this/g;

export const observer = new MutationObserver((mutations) => {
  for (const { target } of mutations) {
    if (isHTMLElement(target, "SCRIPT") && !target.hasAttribute(EH_SKIP_ATTR)) {
      const parent = target.parentElement;

      if (parent && parent.nodeName !== "HEAD") {
        let key = ehElements.keyOf(parent);
        if (typeof key === "undefined") {
          key = ehElements.register(parent);
        }

        let counter = counterMap.get(key);
        if (typeof counter === "undefined") {
          counter = newCounter();
          counterMap.set(key, counter);
        }

        const varName = `eh$${key}$${counter()}`;
        const stmt = `const ${varName} = Eh.elements.get(${key});\n`;

        const scriptText = target.firstChild as Text;
        scriptText.data = stmt + scriptText.data.replace(replaceRgx, varName);
      }
    }
  }
});

observer.observe(document, {
  subtree: true,
  childList: true,
});
