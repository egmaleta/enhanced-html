import { KEY_ATTR, RESPONSE_ATTR } from "../attrs";
import config, { Place } from "../config";
import { AMPERSAND, isEmptyAttr, keyOf, tokenizeAttr } from "../utils";

const VALID_PLACES = [
  "afterbegin",
  "afterend",
  "beforebegin",
  "beforeend",
  "inner",
  "outer",
];

export default function (element: HTMLElement) {
  const resp = element.getAttribute(RESPONSE_ATTR);
  const tokens = !isEmptyAttr(resp) ? tokenizeAttr(resp) : [];

  let target = tokens.length > 0 ? tokens[0] : config.defaultTarget;
  target = target.replace(AMPERSAND, `[${KEY_ATTR}="${keyOf(element)}"]`);

  const place =
    tokens.length > 1 && VALID_PLACES.includes(tokens[1])
      ? (tokens[1] as Place)
      : config.defaultPlace;

  return [target, place] as const;
}
