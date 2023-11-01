export type Place = InsertPosition | "inner" | "outer";
export type HttpMethod = "get" | "post" | "put" | "patch" | "delete";

type Config = {
  defaultMethod: HttpMethod;
  defaultEvent: (element: Element) => keyof HTMLElementEventMap;
  defaultPlace: Place;
};

export default {
  defaultMethod: "get",
  defaultEvent(element) {
    if (element.tagName === "INPUT") {
      const typeAttr = element.getAttribute("type");
      if (typeAttr === "button" || typeAttr === "submit") {
        return "click";
      }
      return "change";
    }

    switch (element.tagName) {
      case "TEXTAREA":
      case "SELECT":
        return "change";
      case "FORM":
        return "submit";
      default:
        return "click";
    }
  },
  defaultPlace: "inner",
} satisfies Config;
