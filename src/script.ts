import { counter, TwoWayMap } from "./utils";

const STORE_NAME = "EhScripted";
if (!(STORE_NAME in window)) {
  Object.defineProperty(window, STORE_NAME, {
    value: new TwoWayMap(),
  });
}

const REPLACE_RGX = /\$this/g;

// @ts-ignore
const store: TwoWayMap<number, Node> = window[STORE_NAME];

const newId = counter();
const count = counter();

const observer = new MutationObserver((mutationList) => {
  for (const { type, target, addedNodes } of mutationList) {
    if (
      type === "childList" &&
      target.nodeName !== "HEAD" &&
      target.nodeName !== "SCRIPT"
    ) {
      let targetId = store.keyOf(target);

      for (const child of addedNodes) {
        if (child.nodeName === "SCRIPT" && child.textContent !== null) {
          if (typeof targetId === "undefined") {
            targetId = newId();
            store.set(targetId, target);
          }

          const varName = `this$${targetId}$${count()}`;
          const code = child.textContent.replace(REPLACE_RGX, varName);

          child.textContent =
            `const ${varName} = window["${STORE_NAME}"].get(${targetId});` +
            code;
        }
      }
    }
  }
});

observer.observe(document, {
  subtree: true,
  childList: true,
});

export default observer;
