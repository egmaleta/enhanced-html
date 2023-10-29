import { HttpMethod } from "./config";

export function makeRequest(
  method: HttpMethod,
  url: URL,
  body: FormData | null,
  onReadyStateChange: XMLHttpRequest["onreadystatechange"]
) {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = onReadyStateChange;

  const reqUrl = new URL(url.href);

  const encoding = body
    ? method === "get"
      ? "application/x-www-form-urlencoded"
      : "multipart/form-data"
    : false;

  if (encoding === "application/x-www-form-urlencoded") {
    for (const [name, value] of body!.entries()) {
      if (typeof value === "string") {
        reqUrl.searchParams.append(name, value);
      }
    }
  }

  xhr.open(method, reqUrl, true);
  xhr.setRequestHeader("Accept", "text/html");
  if (encoding) {
    xhr.setRequestHeader("Content-Type", encoding);
  }

  xhr.send(body);
}
