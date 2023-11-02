import { TRIGGER_ATTR } from "./names";
import { tokenizeAttr } from "./utils";
import config from "../config";

type EventInfo = {
  target: Element;
  event: string;

  once?: boolean;
  changed?: boolean;
};

const TIME_RGX = /^([1-9]\d*)(m?s)$/;

function parseTime(text: string) {
  const match = TIME_RGX.exec(text);
  if (match) {
    const asMilliseconds = match[2] === "ms";
    return +match[1] * (asMilliseconds ? 1 : 1000);
  }
}

const ONCE_MOD = "once";
const CHANGED_MOD = "changed";
const FROM_MOD_RGX = /^from:([^\s]+)$/;

export default function (element: HTMLElement) {
  const tokens = tokenizeAttr(element.getAttribute(TRIGGER_ATTR));

  if (tokens.length > 1 && tokens[0] === "every") {
    // POLL MODE

    const time = parseTime(tokens[1]);
    if (typeof time === "number") {
      return time;
    }

    return;
  }

  // EVENT MODE

  const info: EventInfo = {
    target: element,
    event: config.defaultEvent(element),
  };

  const rest = [];
  for (const token of tokens) {
    if (token === ONCE_MOD) {
      info.once = true;
      continue;
    }

    if (token === CHANGED_MOD) {
      info.changed = true;
      continue;
    }

    const match = FROM_MOD_RGX.exec(token);
    if (match !== null) {
      const eventTarget = document.querySelector(match[1]);
      if (eventTarget) {
        info.target = eventTarget;
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
