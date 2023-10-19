import { counter, isHTMLElement, newParentId, store } from "./common";

const nodeToCounter = new Map<Node, ReturnType<typeof counter>>();
const replaceRgx = /\$this/g;

export const observer = new MutationObserver((mutationList) => {
  for (const { target } of mutationList) {
    if (isHTMLElement(target, "SCRIPT")) {
      const parent = target.parentNode;

      if (parent && !isHTMLElement(parent, "HEAD")) {
        let parentId = store.keyOf(parent);
        if (typeof parentId === "undefined") {
          parentId = newParentId();
          store.set(parentId, parent);
        }

        let newTargetId = nodeToCounter.get(parent);
        if (typeof newTargetId === "undefined") {
          newTargetId = counter();
          nodeToCounter.set(parent, newTargetId);
        }

        const targetId = newTargetId();
        const varName = `eh_${parentId}_${targetId}`;
        const scriptText = target.firstChild as Text;

        scriptText.data =
          `const ${varName} = Eh.store.get(${parentId});\n` +
          scriptText.data.replace(replaceRgx, varName);
      }
    }
  }
});

observer.observe(document, {
  subtree: true,
  childList: true,
});
