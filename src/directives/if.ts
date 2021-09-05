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
        // 现在这里有个BUG，当state的初始值为false时，因为会直接remove掉el，el实际的nextSlibing就会丢失，导致后续的Mount过程都不会再继续。
        // 我想到的解决方法：
        // 1. setTimeout下轮循环时在进行节点的插入或者删除，让后续的内容进行完一轮。 可以解决问题不过并不优雅。
        // 2.递归操作的时候递归进行一份clone。
        // 或许1会好一点。
        // 最新版的petite-vue没有这个BUG，这里先这样，看到后面的代码在返回头解决他。
        let state = evalValue(ctx.scope, value)
        if (state) {
            if (!isAttached) {
                parent?.insertBefore(el, cm)
                parent?.removeChild(cm)
                isAttached = true
            }

        } else {
            // 这里会把一个注释插入到实际应该是v-if的位置，后续如果条件是true，在把这个node根据注释插回去。
            parent?.insertBefore(cm, el)
            parent?.removeChild(el)
            isAttached = false
        }
    })
}