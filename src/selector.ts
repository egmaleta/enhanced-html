import { KEY_ATTR, TEMPLATE_ATTR } from "./attr/names";

export const SELF_SELECTOR = /&/g;

export function selectorByKey(key: string) {
  return `[${KEY_ATTR}="${key}"]`;
}

export function selectorByTemplateId(id: string) {
  return `[${TEMPLATE_ATTR}~="${id}"]`;
}
