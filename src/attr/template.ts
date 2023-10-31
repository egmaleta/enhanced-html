import { TEMPLATE_ATTR } from "./names";
import { isEmptyAttr, tokenizeAttr } from "./utils";

export function handle(element: HTMLElement) {
  const ids = element.getAttribute(TEMPLATE_ATTR);
  if (!isEmptyAttr(ids)) {
    return [...new Set(tokenizeAttr(ids))];
  }

  return [];
}
