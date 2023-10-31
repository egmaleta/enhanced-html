import { ON_ATTR } from "./names";
import { isEmptyAttr } from "./utils";
import config from "../config";

export default function (element: HTMLElement) {
  let trigger = element.getAttribute(ON_ATTR);
  if (isEmptyAttr(trigger)) {
    trigger = config.defaultTrigger(element);
  }

  return trigger;
}
