import { context } from "@/app";
import { show } from "./show";
import { bind } from "./bind";
import { data } from "./data";
import { event } from "./event";
import { text } from "./text";
import { _if } from "./if";
import { _for } from "./for";
import { model } from "./model";

export type Directive<T = Element> = (ctx: DirectiveContext<T>) => void;

export interface DirectiveContext<T> {
  el: T;
  get: (exp?: string) => any;
  value: string;
  ctx: context;
  args: args;
}

export interface args {
  [propName: string]: any;
}

export const buildInDirectives: args = {
  for: _for,
  if: _if,
  show: show,
  bind: bind,
  data: data,
  event: event,
  text: text,
  model: model,
};
