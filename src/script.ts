import { FROM_TEMPLATE_ATTR } from "./attr";
import { store, storeVarName } from "./element";

const templateFuncDec = (scriptContent: string, templateName: string) =>
  `function eh$func$${templateName}($this, $props) {
  ${scriptContent}
}`;

const funcCall = (key: number, scriptContent: string) => `(function () {
  const $this = ${storeVarName}.get(${key});
  const $props = ${storeVarName}.dataOf($this).props;
  ${scriptContent}
})()`;

export function handle(
  element: HTMLElement,
  sourceScript: HTMLScriptElement,
  asTemplate: string | false = false
) {
  if (sourceScript.textContent === null) return;

  const key = store.register(element).key;

  const head = document.head;
  const script = document.createElement("script");
  if (asTemplate === false) {
    script.textContent = funcCall(key, sourceScript.textContent);
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

    script.textContent = funcCall(key, `eh$func$${asTemplate}($this, $props);`);
  }
  head.appendChild(script);
}
