import { observe } from "@/observable"
import { isArray, isObject, isString } from "@/utils"
import { Directive } from "."

const normalizeClass = (newClassNames:Array<string>|Record<any, any>|string):string => {
    if (isArray(newClassNames)) {
        return newClassNames.join(' ')
    } else if (isString(newClassNames)) {
        return newClassNames
    } else if (isObject(newClassNames)) {
        let classNameKeys = []
        for (let key of Object.keys(newClassNames)) {
            if (newClassNames[key]) {
                classNameKeys.push(key)
            }
        }
       
        return classNameKeys.join(' ')

    }

    return ''
}

const normalizeStyle = (newStyles:Record<any, any>) => {
    let newStyleArray:string[] = []

    for (let key of Object.keys(newStyles)) {
        newStyleArray.push(`${key}: ${newStyles[key]}`)
    }
       
    return newStyleArray.join(';')
}

export const bind: Directive = ({ el, get, args }) => {
    // 目前仅处理 :class :style，v-bind这个操作一般都是向组件内传值，不过还没实现组件功能。
    observe(() => {
        let result = get()
        if (args.bindName === 'class') {
            el.setAttribute('class', normalizeClass(result))
        } else if (args.bindName === 'style') {
            el.setAttribute('style', normalizeStyle(result))
        }
    })
}