import { TRIGGER_ATTR, tokenize } from "./attr";
import { store } from "./element";
import type { TriggerContextData } from "./types";

const ONCE_MOD = ":once";
const CHANGED_MOD = ":changed";
const FROM_MOD_PATTERN = /^:from:(\S+)$/;

export function defaultTriggerContextData(
  element: Element
): TriggerContextData {
  let event = "click";
  switch (element.tagName) {
    case "INPUT":
      const typeAttr = element.getAttribute("type");
      if (typeAttr !== "button" && typeAttr !== "submit") {
        event = "change";
      }
      break;
    case "TEXTAREA":
    case "SELECT":
      event = "change";
      break;
    case "FORM":
      event = "submit";
      break;
  }

  return {
    eventTarget: element,
    eventName: event,
  };
}

function addModifiers(data: TriggerContextData, tokens: string[]) {
  for (const token of tokens) {
    if (token === ONCE_MOD) {
      data.triggerEventOnce = true;
    } else if (token === CHANGED_MOD) {
      data.makeRequestWhenValueChange = true;
    } else {
      const match = FROM_MOD_PATTERN.exec(token);
      if (match !== null) {
        const element = document.querySelector(match[1]);
        if (element !== null) {
          Object.assign(data, defaultTriggerContextData(element));
        }
      }
    }
  }
}

export function handleTriggerAttr(element: Element) {
  let attr = element.getAttribute(TRIGGER_ATTR);
  if (attr === null) return;

  const data = store.dataOf(element);
  if (typeof data === "undefined") return;

  Object.assign(data, defaultTriggerContextData(element));

  const tokens = tokenize(attr);
  if (tokens.length > 0) {
    let eventName: string | null = null;
    let modifiers: string[];

    if (!tokens[0].startsWith(":")) {
      eventName = tokens[0];
      modifiers = tokens.slice(1);
    } else {
      modifiers = tokens;
    }

    addModifiers(data as TriggerContextData, modifiers);

    if (eventName !== null) {
      data.eventName = eventName;
    }
  }
}
