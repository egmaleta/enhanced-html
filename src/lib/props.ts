import { PROPS_ATTR } from "./attr";
import { store } from "./element";

export function handlePropsAttr(element: Element) {
  const attr = element.getAttribute(PROPS_ATTR);
  if (attr !== null && attr !== "") {
    const props = store.propsOf(element);
    if (typeof props !== "undefined") {
      const parsed = JSON.parse(attr);
      if (typeof parsed === "object" && !Array.isArray(parsed)) {
        Object.assign(props, parsed);
      }
    }
  }
}
