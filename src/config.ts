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
    switch (element.tagName) {
      case "INPUT":
      case "TEXTAREA":
      case "SELECT":
        return "change";
      case "FORM":
        return "submit";
      default:
        return "click";
    }
  },
  defaultTarget: "&",
  defaultPlace: "inner",
} satisfies Config;
