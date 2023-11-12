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

function formData2UrlSearchParams(fd: FormData) {
  const usp = new URLSearchParams();
  for (const [name, value] of fd.entries()) {
    if (typeof value === "string") {
      usp.append(name, value);
    }
  }

  return usp;
}

function validate(response: Response) {
  if (response.ok) {
    const contentType = response.headers.get("Content-Type");
    if (contentType === null) {
      return Promise.reject(
        `eh: 'Content-Type' header not found in response ${response.url}.`
      );
    }
    if (!contentType.startsWith("text/html")) {
      return Promise.reject(
        `eh: invalid 'Content-Type' header '${contentType}'.`
      );
    }

    return response.text();
  }

  return Promise.reject(
    `eh: request failed with status '${response.status} ${response.statusText}'.`
  );
}

function getResponseTextHandler(data: RequestContextData) {
  const { target, place } = data;

  return function (html: string) {
    switch (place) {
      case "inner":
      case "outer":
        target[`${place}HTML`] = html;
        break;
      default:
        target.insertAdjacentHTML(place as InsertPosition, html);
    }
  };
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

  const formData = getFormData(element);

  const headers: Record<string, string> = {
    Accept: "text/html",
  };

  const encoding =
    formData !== null
      ? data.method === "get"
        ? "application/x-www-form-urlencoded"
        : "multipart/form-data"
      : false;
  if (encoding) {
    headers["Content-Type"] = encoding;
  }

  let body: typeof formData | URLSearchParams = formData;
  if (encoding === "application/x-www-form-urlencoded") {
    body = formData2UrlSearchParams(formData!);
  }

  fetch(url, {
    method,
    headers,
    mode: "same-origin",
    body,
  })
    .then(validate)
    .then(getResponseTextHandler(data))
    .catch(console.log);
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
