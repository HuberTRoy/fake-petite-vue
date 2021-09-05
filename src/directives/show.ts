import { observe } from '@/observable'
import { Directive } from '.'

export const show: Directive<HTMLElement> = ({ el, get }) => {
    const initialDisplay = el.style.display

    observe(() => {
        el.style.display = get() ? initialDisplay : 'none'
    })
}