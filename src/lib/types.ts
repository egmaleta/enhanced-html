export type TriggerContextData = {
  eventName: string;
  eventTarget: Element;

  triggerEventOnce?: boolean;
  makeRequestWhenValueChange?: boolean;
};

export type ResponseContextData = {
  target: Element;
  place: string;
};

export type RequestContextData = {
  method: string;
  url: URL;

  lastValue?: any;
} & TriggerContextData &
  ResponseContextData;
