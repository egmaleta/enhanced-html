type EhAttr = `eh-${string}` | "eh";

export default {
  FOR: "eh-for",
  FROM_TEMPLATE: "eh-from-template",
  KEY: "eh-key",

  // used by devs
  EH: "eh",
  TEMPLATE: "eh-template",
  PROPS: "eh-props",
} satisfies Record<string, EhAttr>;
