import {
  type UseTemplateOptions,
  EH_FROMTEMPL_ATTR,
  ehElements,
} from "./common";

const EH_STYLED_ATTR = "eh-styled";

const replaceRgx = /&/g;

export function handleStyle(element: HTMLElement, parent: HTMLElement) {
  if (element.textContent !== null) {
    let key = ehElements.keyOf(parent);
    if (typeof key === "undefined") {
      key = ehElements.register(parent);
    }

    if (!parent.hasAttribute(EH_STYLED_ATTR)) {
      parent.setAttribute(EH_STYLED_ATTR, `${key}`);
    }

    const selector = `[${EH_STYLED_ATTR}="${key}"]`;
    element.textContent = element.textContent.replace(replaceRgx, selector);
  }
}

export function handleElementStyle(
  element: HTMLElement,
  useTemplate: UseTemplateOptions
) {
  const { templateId, templateElement } = useTemplate;
  if (templateElement.textContent !== null) {
    const selector = `[${EH_STYLED_ATTR}="${templateId}"]`;

    if (
      !document.head.querySelector(
        `style[${EH_FROMTEMPL_ATTR}="${templateId}"]`
      )
    ) {
      const headStyle = document.createElement("style");
      headStyle.setAttribute(EH_FROMTEMPL_ATTR, templateId);
      headStyle.textContent = templateElement.textContent.replace(
        replaceRgx,
        selector
      );
      document.head.appendChild(headStyle);
    }

    element.setAttribute(EH_STYLED_ATTR, templateId);
  }
}
