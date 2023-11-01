import { RESPONSE_ATTR } from "./names";
import { tokenizeAttr } from "./utils";
import config, { type Place } from "../config";

type ResponseInfo = {
  target: Element;
  place: Place;
};

const VALID_PLACES = [
  "afterbegin",
  "afterend",
  "beforebegin",
  "beforeend",
  "inner",
  "outer",
];

export default function (element: HTMLElement) {
  const tokens = tokenizeAttr(element.getAttribute(RESPONSE_ATTR));

  const info: ResponseInfo = {
    target: element,
    place: config.defaultPlace,
  };

  const rest = [];
  for (const token of tokens) {
    if (VALID_PLACES.includes(token)) {
      info.place = token as Place;
    } else {
      rest.push(token);
    }
  }

  if (rest.length > 0) {
    const target = document.querySelector(rest[0]);
    if (target) {
      info.target = target;
    }
  }

  return info;
}
