import attrs from "./attrs";
import { keyOf } from "./utils";

const templateFuncDec = (scriptContent: string, templateName: string) =>
  `function eh$func$${templateName}($this) {
  ${scriptContent}
}`;

const templateFuncCall = (elementQueryExpr: string, templateName: string) =>
  `eh$func$${templateName}(${elementQueryExpr});`;

const anonFuncCall = (elementQueryExpr: string, scriptContent: string) =>
  `(function ($this) {
  ${scriptContent}
})(${elementQueryExpr});`;

export function handle(
  element: HTMLElement,
  sourceScript: HTMLScriptElement,
  asTemplate: string | false = false
) {
  if (sourceScript.textContent === null) return;

  const key = keyOf(element);

  const head = document.head;

  const script = document.createElement("script");
  script.setAttribute(attrs.FOR, `${key}`);

  const queryExpr = `document.querySelector("[${attrs.KEY}='${key}']")`;

  if (asTemplate === false) {
    script.textContent = anonFuncCall(queryExpr, sourceScript.textContent);
  } else {
    if (!head.querySelector(`script[${attrs.FROM_TEMPLATE}="${asTemplate}"]`)) {
      const templScript = document.createElement("script");
      templScript.setAttribute(attrs.FROM_TEMPLATE, asTemplate);
      templScript.textContent = templateFuncDec(
        sourceScript.textContent,
        asTemplate
      );
      head.appendChild(templScript);
    }

    script.textContent = templateFuncCall(queryExpr, asTemplate);
  }

  head.appendChild(script);
}
