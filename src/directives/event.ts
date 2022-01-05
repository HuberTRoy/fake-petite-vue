import { Directive } from ".";

export const event: Directive = ({ el, get, args, ctx, value }) => {
  el.addEventListener(args.event, e => {
    get();
  });
};
