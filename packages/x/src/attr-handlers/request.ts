import config, { HttpMethod } from "../config";
import { REQUEST_ATTR, isEmptyAttr } from "../attrs";
import { tokenizeAttr } from "../utils";

const VALID_METHODS = ["get", "post", "put", "patch", "delete"];

export default function (element: HTMLElement) {
  const req = element.getAttribute(REQUEST_ATTR);

  const tokens = !isEmptyAttr(req) ? tokenizeAttr(req) : [];
  if (tokens.length === 0) return;

  const [method, path] =
    tokens.length === 1 ? [config.defaultMethod, tokens[0]] : tokens;

  if (!VALID_METHODS.includes(method)) return;

  return [
    method as HttpMethod,
    new URL(path, globalThis.location.origin),
  ] as const;
}
