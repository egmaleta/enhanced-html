import { REQUEST_ATTR } from "./names";
import { tokenizeAttr } from "./utils";
import config, { type HttpMethod } from "../config";

const VALID_METHODS = ["get", "post", "put", "patch", "delete"];

export default function (element: HTMLElement) {
  const tokens = tokenizeAttr(element.getAttribute(REQUEST_ATTR));
  if (tokens.length === 0) return;

  const [method, pathname] =
    tokens.length === 1 ? [config.defaultMethod, tokens[0]] : tokens;

  if (!VALID_METHODS.includes(method)) return;

  return [
    method as HttpMethod,
    new URL(pathname, window.location.origin),
  ] as const;
}
