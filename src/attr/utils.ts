import { KEY_ATTR } from "./names";

export function isEmptyAttr(attr: string | null): attr is null | "" {
  return attr === null || attr.length === 0;
}

export function selectorByKey(key: string) {
  return `[${KEY_ATTR}="${key}"]`;
}

const EXTRA_SPACE = /\s+/;

export function tokenizeAttr(attr: string) {
  return attr.trim().split(EXTRA_SPACE);
}
