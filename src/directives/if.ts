import { observe } from '@/observable'
import { context } from '../app'
import { Directive } from '.'
import { evalValue } from '@/eval'

export const _if: Directive<HTMLElement> = (el, value:string, ctx:context) => {
    // const initialDisplay = el.style.display
    let isAttached = true
    let parent = el.parentNode
    let cm = new Comment('v-if')

    observe(() => {
        // el.style.display = evalValue(ctx.scope, value) ? initialDisplay : 'none'
        let state = evalValue(ctx.scope, value)
        if (state) {
            if (!isAttached) {
                parent?.insertBefore(el, cm)
                isAttached = true
            }

        } else {
            parent?.insertBefore(cm, el)
            parent?.removeChild(el)
            isAttached = false
        }
    })
}