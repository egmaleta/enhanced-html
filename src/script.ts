import { FOR_ATTR, FROMTEMPL_ATTR } from "./attrs";
import { ehElements } from "./common";

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

  const head = document.head;

  const script = document.createElement("script");
  script.setAttribute(FOR_ATTR, `${key}`);

  if (asTemplate === false) {
    script.textContent = `(function ($this) { ${sourceScript.textContent} })(eh.elements.get(${key}));`;
  } else {
    if (!head.querySelector(`script[${FROMTEMPL_ATTR}="${asTemplate}"]`)) {
      const templScript = document.createElement("script");
      templScript.setAttribute(FROMTEMPL_ATTR, asTemplate);
      templScript.textContent = `function eh$func$${asTemplate}($this){ ${sourceScript.textContent} }`;
      head.appendChild(templScript);
    }

    script.textContent = `eh$func$${asTemplate}(eh.elements.get(${key}));`;
  }

  head.appendChild(script);
}
