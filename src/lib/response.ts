import { RESPONSE_ATTR } from "./attr";
import { store } from "./element";
import type { ResponseContextData } from "./types";

const PATTERN =
  /^(\S+)?\s*(afterbegin|afterend|beforebegin|beforeend|inner|outer)?$/;

export function defaultResponseContextData(
  element: Element
): ResponseContextData {
  return {
    target: element,
    place: "inner",
  };
}

export function handleResponseAttr(element: HTMLElement) {
  const attr = element.getAttribute(RESPONSE_ATTR);
  if (attr === null) return;

  const data = store.dataOf(element);
  if (typeof data === "undefined") return;

  Object.assign(data, defaultResponseContextData(element));

  const match = PATTERN.exec(attr.trim());
  if (match !== null) {
    const query: string | undefined = match[1];
    if (typeof query !== "undefined") {
      const target = document.querySelector(query);
      if (target !== null) {
        data.target = target;
      }
    }

    const place: string | undefined = match[2];
    if (typeof place !== "undefined") {
      data.place = place;
    }
  }
}
