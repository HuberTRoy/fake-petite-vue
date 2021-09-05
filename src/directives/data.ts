import { observable } from "@/observable"
import { context } from "@/app"

export const data = (ctx:context, value:string) => {
    
    let newValue = ctx.scope[value]
    if (typeof newValue === 'function') {
        newValue = newValue()
    }

    return {
        ...ctx,
        scope: observable(newValue)
    }
}