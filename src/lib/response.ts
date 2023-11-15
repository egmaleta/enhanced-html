import { SWAP_ATTR, TARGET_ATTR } from "./attr";
import { store } from "./element";

const VALID_PLACES = [
  "beforebegin",
  "afterbegin",
  "beforeend",
  "afterend",
  "innerHTML",
  "outerHTML",
];

export const DEFAULT_PLACE = "innerHTML";

export function handleTargetAttr(element: Element) {
  const selector = element.getAttribute(TARGET_ATTR);
  if (selector !== null) {
    const data = store.dataOf(element);
    if (typeof data !== "undefined") {
      const target = document.querySelector(selector);
      data.target = target ?? element;
    }
  }
}

export function handleSwapAttr(element: Element) {
  const place = element.getAttribute(SWAP_ATTR);
  if (place !== null) {
    const data = store.dataOf(element);
    if (typeof data !== "undefined") {
      data.place = VALID_PLACES.includes(place) ? place : DEFAULT_PLACE;
    }
  }
}
