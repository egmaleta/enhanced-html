import attrs from "./attrs";
import { keyOf } from "./utils";

const templateFuncDec = (scriptContent: string, templateName: string) =>
  `function eh$func$${templateName}($this, $props) {
  ${scriptContent}
}`;

const templateFuncCall = (
  queryExpr: string,
  propsExpr: string,
  templateName: string
) => `eh$func$${templateName}(${queryExpr}, ${propsExpr});`;

const anonFuncCall = (
  queryExpr: string,
  propsExpr: string,
  scriptContent: string
) =>
  `(function ($this, $props) {
  ${scriptContent}
})(${queryExpr}, ${propsExpr});`;

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

  const queryExpr = `document.querySelector(\`[${attrs.KEY}="${key}"]\`)`;

  let propsExpr: string;
  const propsStr = element.getAttribute(attrs.PROPS);
  if (propsStr === null || propsStr.length === 0) {
    propsExpr = "null";
  } else {
    propsExpr = `JSON.parse(\`${propsStr}\`)`;
  }

  if (asTemplate === false) {
    script.textContent = anonFuncCall(
      queryExpr,
      propsExpr,
      sourceScript.textContent
    );
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

    script.textContent = templateFuncCall(queryExpr, propsExpr, asTemplate);
  }

  head.appendChild(script);
}
