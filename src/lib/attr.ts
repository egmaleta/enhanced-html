export const FROM_TEMPLATE_ATTR = "eh-from-template";
export const KEY_ATTR = "eh-key";

// used by devs
export const EH_ATTR = "eh";
export const TEMPLATE_ATTR = "eh-template";
export const PROPS_ATTR = "eh-props";
export const REQUEST_ATTR = "eh-request";
export const RESPONSE_ATTR = "eh-response";
export const TRIGGER_ATTR = "eh-trigger";

const EXTRA_SPACE = /\s+/;
export function tokenize(attr: string) {
  return attr.trim().split(EXTRA_SPACE);
}
