import { default as handleEventAttr } from "./attr/event";
import { default as handleResponseAttr } from "./attr/response";
import { default as handleRequestAttr } from "./attr/request";
import { isTaggedHTMLElement } from "./element";
import { makeRequest } from "./xhr";

export function handle(element: HTMLElement) {
  const tuple = handleRequestAttr(element);
  if (!tuple) return;

  const [method, url] = tuple;

  const eventInfo = handleEventAttr(element);
  const [target, place] = handleResponseAttr(element);

  eventInfo.eventTarget.addEventListener(
    eventInfo.event,
    () => {
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

      const targetElement = document.querySelector(target);
      if (!targetElement) return;

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
                targetElement[`${place}HTML`] = html;
                break;
              default:
                targetElement.insertAdjacentHTML(place, html);
            }
          }
        }
      });
    },
    { once: eventInfo.once }
  );
}
