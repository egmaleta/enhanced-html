import { EVENT_ATTR } from "./names";
import { isEmptyAttr, tokenizeAttr } from "./utils";
import config from "../config";

type EventInfo = {
  eventTarget: Element;
  event: string;

  once?: boolean;
};

const ONCE_MOD = "once";
const FROM_MOD = /^from:([^\s]+)$/;

export default function (element: HTMLElement) {
  const attr = element.getAttribute(EVENT_ATTR);
  const tokens = !isEmptyAttr(attr) ? tokenizeAttr(attr) : [];

  const info: EventInfo = {
    eventTarget: element,
    event: config.defaultEvent(element),
  };

  const rest = [];
  for (const token of tokens) {
    if (token === ONCE_MOD) {
      info.once = true;
      continue;
    }

    const match = FROM_MOD.exec(token);
    if (match !== null) {
      const eventTarget = document.querySelector(match[1]);
      if (eventTarget) {
        info.eventTarget = eventTarget;
        info.event = config.defaultEvent(eventTarget);
      }
      continue;
    }

    rest.push(token);
  }

  if (rest.length > 0) {
    info.event = rest[0];
  }

  return info;
}
