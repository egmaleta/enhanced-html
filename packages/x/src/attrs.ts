export { KEY_ATTR } from "../../enhanced-html/src/attrs";

export const REQUEST_ATTR = "eh-req";
export const RESPONSE_ATTR = "eh-resp";
export const ON_ATTR = "eh-on";

export function isEmptyAttr(attr: string | null): attr is null | "" {
  return attr === null || attr.length === 0;
}
