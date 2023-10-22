import {
  type UseTemplateOptions,
  EH_FROMTEMPL_ATTR,
  ehElements,
} from "./common";

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

export function handleScript(
  element: HTMLElement,
  parent: HTMLElement,
  useTemplate?: UseTemplateOptions
) {
  if (element.textContent !== null) {
    let key = ehElements.keyOf(parent);
    if (typeof key === "undefined") {
      key = ehElements.register(parent);
    }

    let props = propsCache.get(key);
    if (typeof props === "undefined") {
      props = getProps(parent);
      propsCache.set(key, props);
    }

    if (!useTemplate) {
      const thisVarStmt = `const $this = Eh.elements.get(${key});`;
      const propsVarStmt = `const $props = Eh.props.get(${key});`;
      element.textContent = `{\n${thisVarStmt}\n${propsVarStmt}\n${element.textContent}}`;
    } else {
      const { templateId, templateElement } = useTemplate;

      if (
        !document.head.querySelector(
          `script[${EH_FROMTEMPL_ATTR}="${templateId}"]`
        )
      ) {
        const headScript = document.createElement("script");
        headScript.setAttribute(EH_FROMTEMPL_ATTR, templateId);
        headScript.textContent = `function eh$func$${templateId}($this, $props){${
          templateElement.textContent ?? ""
        }}`;
        document.head.appendChild(headScript);
      }

      element.textContent = `eh$func$${templateId}(Eh.elements.get(${key}), Eh.props.get(${key}));`;
    }
  }
}
