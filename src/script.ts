import attrs from "./attrs";
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
  script.setAttribute(attrs.FOR, `${key}`);

  if (asTemplate === false) {
    script.textContent = `(function ($this) { ${sourceScript.textContent} })(eh.elements.get(${key}));`;
  } else {
    if (!head.querySelector(`script[${attrs.FROM_TEMPLATE}="${asTemplate}"]`)) {
      const templScript = document.createElement("script");
      templScript.setAttribute(attrs.FROM_TEMPLATE, asTemplate);
      templScript.textContent = `function eh$func$${asTemplate}($this){ ${sourceScript.textContent} }`;
      head.appendChild(templScript);
    }

    script.textContent = `eh$func$${asTemplate}(eh.elements.get(${key}));`;
  }

  head.appendChild(script);
}
