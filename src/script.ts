import { EH_FROMTEMPL_ATTR, ehElements } from "./common";

function getProps(
  element: HTMLElement
): string | number | boolean | object | null {
  const raw = element.dataset.ehProps;
  if (typeof raw !== "undefined") {
    try {
      const parsed = JSON.parse(raw);
      if (typeof parsed !== "undefined") {
        element.removeAttribute("data-eh-props");
        return parsed;
      }
    } catch {
      console.log(`Eh:\tcouldn't parse props of ${element}.`);
    }
  }
  return null;
}

export const propsCache = new Map<
  number,
  string | number | boolean | object | null
>();

const EH_FOR_ATTR = "eh-for";

export function handle(
  element: HTMLElement,
  sourceScript: HTMLScriptElement,
  asTemplate: string | false = false
) {
  if (sourceScript.textContent === null) return;

  let key = ehElements.keyOf(element);
  if (typeof key === "undefined") {
    key = ehElements.register(element);
  }

  let props = propsCache.get(key);
  if (typeof props === "undefined") {
    props = getProps(element);
    propsCache.set(key, props);
  }

  const head = document.head;

  const script = document.createElement("script");
  script.setAttribute(EH_FOR_ATTR, `${key}`);

  if (asTemplate === false) {
    script.textContent = `{
      const $this = Eh.elements.get(${key});
      const $props = Eh.props.get(${key});
      ${sourceScript.textContent}
    }`;
  } else {
    if (!head.querySelector(`script[${EH_FROMTEMPL_ATTR}="${asTemplate}"]`)) {
      const templScript = document.createElement("script");
      templScript.setAttribute(EH_FROMTEMPL_ATTR, asTemplate);
      templScript.textContent = `function eh$func$${asTemplate}($this, $props){
        ${sourceScript.textContent}
      }`;
      head.appendChild(templScript);
    }

    script.textContent = `eh$func$${asTemplate}(Eh.elements.get(${key}), Eh.props.get(${key}));`;
  }

  head.appendChild(script);
}
