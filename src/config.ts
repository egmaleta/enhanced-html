import { isTaggedHTMLElement } from "./element";

export type Place = InsertPosition | "inner" | "outer";
export type HttpMethod = "get" | "post" | "put" | "patch" | "delete";

type Config = {
  defaultMethod: HttpMethod;
  defaultTrigger: (element: HTMLElement) => keyof HTMLElementEventMap;
  defaultTarget: string;
  defaultPlace: Place;
};

export default {
  defaultMethod: "get",
  defaultTrigger(element) {
    if (isTaggedHTMLElement(element, "FORM")) {
      return "submit";
    }
    if (
      isTaggedHTMLElement(element, "INPUT") ||
      isTaggedHTMLElement(element, "TEXTAREA") ||
      isTaggedHTMLElement(element, "SELECT")
    ) {
      return "change";
    }
    return "click";
  },
  defaultTarget: "&",
  defaultPlace: "inner",
} satisfies Config;
