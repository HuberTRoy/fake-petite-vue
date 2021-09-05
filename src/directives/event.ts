import { Directive } from "."
import { context } from "@/app"
import { evalValue } from "@/eval"

export const event: Directive = (el:Element, value:string, ctx:context, args) => {
    el.addEventListener(args.event, (e) => {
        evalValue(ctx.scope, value)
    })

}