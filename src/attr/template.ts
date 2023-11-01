import { TEMPLATE_ATTR } from "./names";
import { tokenizeAttr } from "./utils";

export function handle(element: HTMLElement) {
  const attr = element.getAttribute(TEMPLATE_ATTR);
  return [...new Set(tokenizeAttr(attr))];
}
