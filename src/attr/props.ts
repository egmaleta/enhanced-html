import { store } from "../element";
import { PROPS_ATTR } from "./names";
import { isEmptyAttr } from "./utils";

export default function (element: Element) {
  const attr = element.getAttribute(PROPS_ATTR);
  if (!isEmptyAttr(attr)) {
    const data = store.register(element);
    data.props = JSON.parse(attr);
  }
}
