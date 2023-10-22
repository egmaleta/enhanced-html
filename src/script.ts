import { ehElements } from "./common";
import { newCounter } from "./utils";

function getProps(
  element: HTMLElement
): string | number | boolean | object | null {
  const raw = element.dataset.ehProps;
  if (typeof raw !== "undefined") {
    try {
      const parsed = JSON.parse(raw);
      if (typeof parsed !== "undefined") return parsed;
    } catch {
      console.log(`Eh:\tcouldn't parse props of ${element}.`);
    }
  }
  return null;
}

const counterMap = new Map<number, ReturnType<typeof newCounter>>();

const replaceThisVarRgx = /\$this/g;
const replacePropsVarRgx = /\$props/g;

export const propsCache = new Map<
  number,
  string | number | boolean | object | null
>();

export function handle(element: HTMLElement, parent: HTMLElement) {
  if (element.textContent !== null) {
    let key = ehElements.keyOf(parent);
    if (typeof key === "undefined") {
      key = ehElements.register(parent);
    }

    let counter = counterMap.get(key);
    if (typeof counter === "undefined") {
      counter = newCounter();
      counterMap.set(key, counter);
    }
    const count = counter();

    let props = propsCache.get(key);
    if (typeof props === "undefined") {
      props = getProps(parent);
      propsCache.set(key, props);
    }

    const thisVar = `eh$element$${key}$${count}`;
    const thisVarStmt = `const ${thisVar} = Eh.elements.get(${key});\n`;

    const propsVar = `eh$props$${key}$${count}`;
    const propsVarStmt = `const ${propsVar} = Eh.props.get(${key});\n`;

    element.textContent =
      thisVarStmt +
      propsVarStmt +
      element.textContent
        .replace(replaceThisVarRgx, thisVar)
        .replace(replacePropsVarRgx, propsVar);
  }
}
