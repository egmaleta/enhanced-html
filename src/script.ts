import { keyOf } from "./attr/key";
import { FOR_ATTR, FROM_TEMPLATE_ATTR, PROPS_ATTR } from "./attr/names";
import { selectorByKey } from "./attr/utils";

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
  script.setAttribute(FOR_ATTR, `${key}`);

  const queryExpr = `document.querySelector(\`${selectorByKey(key)}\`)`;

  let propsExpr: string;
  const propsStr = element.getAttribute(PROPS_ATTR);
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
    if (!head.querySelector(`script[${FROM_TEMPLATE_ATTR}="${asTemplate}"]`)) {
      const templScript = document.createElement("script");
      templScript.setAttribute(FROM_TEMPLATE_ATTR, asTemplate);
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
