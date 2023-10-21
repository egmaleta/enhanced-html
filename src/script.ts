import { EH_SKIP_ATTR, ehElements } from "./common";
import { counter, isHTMLElement } from "./utils";

const countMap = new Map<number, ReturnType<typeof counter>>();
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

        let count = countMap.get(key);
        if (typeof count === "undefined") {
          count = counter();
          countMap.set(key, count);
        }

        const varName = `eh$${key}$${count()}`;
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
