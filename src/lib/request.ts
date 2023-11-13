import { REQUEST_ATTR_PATTERN } from "./attr";
import { getInheritedData, isHTMLElement, store } from "./element";
import { defaultResponseContextData } from "./response";
import { defaultTriggerContextData } from "./trigger";
import type { RequestContextData } from "./types";

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

  const { method, pathName } = data;
  const url = new URL(pathName, window.location.origin);

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
    if (formData) {
      for (const [name, value] of formData.entries()) {
        if (typeof value === "string") {
          url.searchParams.append(name, value);
        }
      }
    }

    xhr.open(method, url);
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
  let method: string | null = null;
  let pathName: string | null = null;
  for (const { name, value } of element.attributes) {
    const match = REQUEST_ATTR_PATTERN.exec(name);
    if (match !== null) {
      method = match[1];
      pathName = value;
      break;
    }
  }
  if (method === null || pathName === null) return;

  const data = Object.assign(
    {
      method,
      pathName,
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
