export function isEmptyAttr(attr: string | null): attr is null | "" {
  return attr === null || attr.length === 0;
}

const EXTRA_SPACE = /\s+/;

export function tokenizeAttr(attr: string | null) {
  return !isEmptyAttr(attr) ? attr.trim().split(EXTRA_SPACE) : [];
}
