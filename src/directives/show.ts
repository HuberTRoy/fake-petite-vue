import { observe } from '@/observable'
import { context } from '../app'
import { Directive } from '.'
import { evalValue } from '@/eval'

export const show: Directive<HTMLElement> = (el, value:string, ctx:context) => {
    const initialDisplay = el.style.display

    observe(() => {
        el.style.display = evalValue(ctx.scope, value) ? initialDisplay : 'none'
    })
}