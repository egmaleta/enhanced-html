import { EH_ATTR, FROM_TEMPLATE_ATTR, KEY_ATTR, TEMPLATE_ATTR } from "./attr";
import { isHTMLElement, store, storeVarName } from "./element";

const templateFuncDec = (scriptContent: string, templateName: string) =>
  `function eh$func$${templateName}(element, props) {
  ${scriptContent}
}`;

const funcCall = (key: number, scriptContent: string) => `(function () {
  const element = ${storeVarName}.get(${key});
  const props = ${storeVarName}.propsOf(element);
  ${scriptContent}
})()`;

export function handleScript(
  element: Element,
  sourceScript: HTMLScriptElement,
  asTemplate: string | false = false
) {
  if (sourceScript.textContent === null) return;

  const key = store.keyOf(element);
  if (typeof key === "undefined") return;

  const head = document.head;
  const script = document.createElement("script");
  if (asTemplate === false) {
    script.textContent = funcCall(key, sourceScript.textContent);
  } else {
    if (
      head.querySelector(`script[${FROM_TEMPLATE_ATTR}="${asTemplate}"]`) ===
      null
    ) {
      const templScript = document.createElement("script");
      templScript.setAttribute(FROM_TEMPLATE_ATTR, asTemplate);
      templScript.textContent = templateFuncDec(
        sourceScript.textContent,
        asTemplate
      );
      head.appendChild(templScript);
    }

    script.textContent = funcCall(
      key,
      `eh$func$${asTemplate}(element, props);`
    );
  }
  head.appendChild(script);
}

const SELF_SELECTOR = /&/g;

export function handleStyle(
  element: Element,
  sourceStyle: HTMLStyleElement,
  asTemplate: string | false = false
) {
  if (sourceStyle.textContent === null) return;

  const key = store.keyOf(element);
  if (typeof key === "undefined") return;

  const head = document.head;

  if (asTemplate === false) {
    element.setAttribute(KEY_ATTR, key.toString());

    const style = document.createElement("style");
    style.textContent = sourceStyle.textContent.replace(
      SELF_SELECTOR,
      `[${KEY_ATTR}="${key}"]`
    );
    head.appendChild(style);
  } else {
    if (
      head.querySelector(`style[${FROM_TEMPLATE_ATTR}="${asTemplate}"]`) ===
      null
    ) {
      const style = document.createElement("style");
      style.setAttribute(FROM_TEMPLATE_ATTR, asTemplate);
      style.textContent = sourceStyle.textContent.replace(
        SELF_SELECTOR,
        `[${TEMPLATE_ATTR}~="${asTemplate}"]`
      );
      head.appendChild(style);
    }
  }
}

export function handleEhAttr(
  element: Element,
  child: HTMLScriptElement | HTMLStyleElement
) {
  if (element.hasAttribute(EH_ATTR)) {
    if (isHTMLElement(child, "SCRIPT")) {
      handleScript(element, child);
    } else {
      handleStyle(element, child);
    }

    element.removeChild(child);
  }
}
