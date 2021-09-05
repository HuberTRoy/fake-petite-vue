import { Directive } from "."

export const event: Directive = ({ el, get, args }) => {
    el.addEventListener(args.event, (e) => {
        get()
    })

}