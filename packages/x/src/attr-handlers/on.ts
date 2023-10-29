import { ON_ATTR, isEmptyAttr } from "../attrs";
import config from "../config";

export function handle(element: HTMLElement) {
  let trigger = element.getAttribute(ON_ATTR);
  if (isEmptyAttr(trigger)) {
    trigger = config.defaultTrigger(element);
  }

  return trigger;
}
