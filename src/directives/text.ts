import { observe } from "@/observable"
import { context } from "@/app"
import { evalValue } from "@/eval"

export function text(node:Node, ctx:context, texts:string) {
    observe(() => {
        (node as Text).data = evalValue(ctx.scope, texts)
    })
}