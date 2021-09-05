import { context } from "@/app"
import { show } from "./show"
import { bind } from "./bind"
import { data } from "./data"
import { event } from "./event"
import { text } from "./text"
import { _if } from './if'

export type Directive<T = Element> = (
    el: T,
    value: string,
    ctx: context,
    args: args
) => void

export interface args {
    [propName: string]: any;
}

export const buildInDirectives:args = {
    if: _if,
    show: show,
    bind: bind,
    data: data,
    event: event,
    text: text
}