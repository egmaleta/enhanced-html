import { ON_ATTR } from "../attrs";
import config from "../config";
import { isEmptyAttr } from "../utils";

export default function (element: HTMLElement) {
  let trigger = element.getAttribute(ON_ATTR);
  if (isEmptyAttr(trigger)) {
    trigger = config.defaultTrigger(element);
  }

  return trigger;
}
