import { REQUEST_ATTR } from "./attr";
import { getInheritedData, isHTMLElement, store } from "./element";
import { defaultResponseContextData } from "./response";
import { defaultTriggerContextData } from "./trigger";
import type { RequestContextData } from "./types";

const PATTERN = /^(get|post|put|patch|delete)?\s*(\S+)$/;

const DEFAULT_METHOD = "get";

function elementValue(element: Element) {
  return (element as any).value;
}

function getFormData(element: Element) {
  let fd: FormData | null = null;

  if (isHTMLElement(element, "FORM")) {
    fd = new FormData(element);
  } else if (isHTMLElement(element, "SELECT")) {
    fd = new FormData();
    for (const optionElement of element.selectedOptions) {
      fd.append(element.name, optionElement.value);
    }
  } else if (
    isHTMLElement(element, "INPUT") ||
    isHTMLElement(element, "TEXTAREA")
  ) {
    fd = new FormData();
    if ("files" in element && element.files !== null) {
      for (const file of element.files) {
        fd.append(element.name, file);
      }
    } else {
      fd.append(element.name, element.value);
    }
  }

  return fd;
}

function handleResponseHtml(html: string, data: RequestContextData) {
  const { target, place } = data;

  switch (place) {
    case "inner":
    case "outer":
      target[`${place}HTML`] = html;
      break;
    default:
      target.insertAdjacentHTML(place as InsertPosition, html);
  }
}

function makeRequest(element: Element, data: RequestContextData) {
  if (data.makeRequestWhenValueChange) {
    const value = elementValue(element);
    if (value === data.lastValue) {
      return;
    }

    data.lastValue = value;
  }

  const { method, url } = data;

  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (this.readyState === XMLHttpRequest.HEADERS_RECEIVED) {
      const responseContentType = this.getResponseHeader("Content-Type");
      if (
        responseContentType === null ||
        !responseContentType.startsWith("text/html")
      ) {
        this.abort();
        return;
      }
    }

    if (this.readyState === XMLHttpRequest.DONE) {
      const status = this.status;
      if (status >= 200 && status < 400) {
        handleResponseHtml(this.responseText, data);
      }
    }
  };

  const formData = getFormData(element);

  if (method === "get") {
    // get data from element (if any) and add it to url
    const urlCopy = new URL(url);
    if (formData) {
      for (const [name, value] of formData.entries()) {
        if (typeof value === "string") {
          urlCopy.searchParams.append(name, value);
        }
      }
    }

    xhr.open(method, urlCopy);
    xhr.send();
  } else {
    xhr.open(method, url);

    if (formData !== null) {
      const encoding = isHTMLElement(element, "FORM")
        ? element.encoding
        : "multipart/form-data";
      xhr.setRequestHeader("Content-Type", encoding);
    }

    xhr.send(formData);
  }
}

export function handleRequestAttr(element: Element) {
  const attr = element.getAttribute(REQUEST_ATTR);
  if (attr === null) return;

  const match = PATTERN.exec(attr.trim());
  if (match === null) return;

  const data = Object.assign(
    {
      method: match[1] ?? DEFAULT_METHOD,
      url: new URL(match[2], window.location.origin),
    },
    defaultTriggerContextData(element),
    defaultResponseContextData(element),
    getInheritedData(element),
    store.dataOf(element)
  ) as RequestContextData;

  const {
    eventTarget,
    eventName,
    triggerEventOnce,
    makeRequestWhenValueChange,
  } = data;

  if (makeRequestWhenValueChange) {
    data.lastValue = elementValue(element);
  }

  eventTarget.addEventListener(
    eventName,
    () => {
      makeRequest(element, data);
    },
    { once: triggerEventOnce }
  );
}
