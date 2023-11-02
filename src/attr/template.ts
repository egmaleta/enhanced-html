import { TEMPLATE_ATTR } from "./names";
import { tokenizeAttr } from "./utils";

export default function (element: HTMLElement) {
  const attr = element.getAttribute(TEMPLATE_ATTR);
  return [...new Set(tokenizeAttr(attr))];
}
