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

  const url = path.startsWith("/")
    ? new URL(path, window.location.origin)
    : new URL(`${window.location.origin}${window.location.pathname}${path}`);

  return [method as HttpMethod, url] as const;
}
