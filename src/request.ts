import { default as handleTriggerAttr } from "./attr/trigger";
import { default as handleResponseAttr } from "./attr/response";
import { default as handleRequestAttr } from "./attr/request";
import { isTaggedHTMLElement } from "./element";
import { makeRequest } from "./xhr";

function getValue(element: any) {
  return element.value;
}

export function handle(element: HTMLElement) {
  const requestInfo = handleRequestAttr(element);
  if (!requestInfo) return;
  const { method, url } = requestInfo;

  const trigger = handleTriggerAttr(element);
  if (typeof trigger === "undefined") return;

  const { target, place } = handleResponseAttr(element);

  let pollingShouldStop = false;

  const callback = () => {
    let fd: FormData | null = null;

    if (isTaggedHTMLElement(element, "FORM")) {
      fd = new FormData(element);
    } else if (isTaggedHTMLElement(element, "SELECT")) {
      fd = new FormData();
      for (const optionElement of element.selectedOptions) {
        fd.append(element.name, optionElement.value);
      }
    } else if (
      isTaggedHTMLElement(element, "INPUT") ||
      isTaggedHTMLElement(element, "TEXTAREA")
    ) {
      fd = new FormData();
      if ("files" in element && element.files) {
        for (const file of element.files) {
          fd.append(element.name, file);
        }
      } else {
        fd.append(element.name, element.value);
      }
    }

    makeRequest(method, url, fd, function () {
      if (this.readyState === XMLHttpRequest.HEADERS_RECEIVED) {
        const contentType = this.getResponseHeader("Content-Type");
        if (contentType === null || !contentType.startsWith("text/html")) {
          this.abort();
        }
        return;
      }

      if (this.readyState === XMLHttpRequest.DONE) {
        const status = this.status;
        if (status >= 200 && status < 400) {
          const html = this.responseText;

          switch (place) {
            case "inner":
            case "outer":
              target[`${place}HTML`] = html;
              break;
            default:
              target.insertAdjacentHTML(place, html);
          }

          pollingShouldStop = typeof trigger === "number" && status === 286;
        }
      }
    });
  };

  if (typeof trigger === "number") {
    while (!pollingShouldStop) {
      setTimeout(callback, trigger);
    }
    return;
  }

  const { target: eventTarget, event, changed, once } = trigger;

  let eventTargetLastValue = changed && getValue(eventTarget);

  eventTarget.addEventListener(
    event,
    () => {
      if (changed) {
        const value = getValue(eventTarget);
        if (value === eventTargetLastValue) {
          return;
        }
        eventTargetLastValue = value;
      }
      callback();
    },
    { once }
  );
}
