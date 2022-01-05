import { observable } from "./observable";
import { process } from "./process";

export interface context {
  scope: Record<string, any>;
  dirList: Record<string, any>;
}

export function createApp() {
  const context: context = {
    scope: observable({}),
    dirList: {},
  };

  return {
    data(key: string, value: Function) {
      context.scope[key] = value;
    },
    directive() {},
    mount: (el: string | Element) => {
      el =
        typeof el === "string"
          ? document.querySelector(el) || document.body
          : el;

      process(el, context);
    },
    context,
  };
}
