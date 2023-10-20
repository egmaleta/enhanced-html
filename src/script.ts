import { counter, getEhId } from "./utils";
import { ID } from "./eh-attrs";

const nodeToCount = new Map<Node, ReturnType<typeof counter>>();
const replaceRgx = /\$this/g;

export const observer = new MutationObserver((mutationList) => {
  for (const { target } of mutationList) {
    if (target.nodeName === "SCRIPT") {
      const parent = target.parentElement;

      if (parent && parent.nodeName !== "HEAD") {
        let count = nodeToCount.get(parent);
        if (typeof count === "undefined") {
          count = counter();
          nodeToCount.set(parent, count);
        }

        const parentEhId = getEhId(parent);
        const varName = `eh_${parentEhId}_${count()}`;
        const query = `document.querySelector("[${ID}='${parentEhId}']")`;

        const scriptText = target.firstChild as Text;
        scriptText.data =
          `const ${varName} = ${query};\n` +
          scriptText.data.replace(replaceRgx, varName);
      }
    }
  }
});

observer.observe(document, {
  subtree: true,
  childList: true,
});
