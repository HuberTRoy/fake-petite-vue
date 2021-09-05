import { context } from './app'

import { Directive, buildInDirectives, args } from './directives'
import { event } from './directives/event'
import { bind } from './directives/bind'
import { data } from './directives/data'
import { text } from './directives/text'

let textRe = /\{\{(.+?)\}\}/g
let directiveRe = /^[v\-|\:|@]/


export function applyDirective(el:Element, name: string, value:string, ctx:context) {
    let dir:Directive
    let args:args = {}
    // 不支持modifier
    // 绑定属性，暂时没有用
    if (name[0] === ':') {
        console.log("暂时没用")
        dir = bind
    } else if ( name[0] === '@' ) {
        // 进行事件监听
        dir = event
        name = name.slice(1)
        args.event = name
    } else {
        // v- 指令
        let dirName:string = name.slice(2)
        dir = buildInDirectives[dirName] || ctx.dirList[dirName]

    }
    if (dir) {
        dir(el, value, ctx, args)
    }
}

export function process(node:Node, ctx:context) {
    // nodeType https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
    // 1： An Element node like <p> or <div>.
    // debugger
    console.log(node)
    // if (node.attributes && node.attributes.id && node.attributes.id.value === 'test') {
    //     debugger
    // }
    if (node.nodeType === 1) {
        let el = node as Element
        let dataScope:string|null = el.getAttribute('v-data')
    
        if (dataScope) {
            ctx = data(ctx, dataScope)
    
            el.removeAttribute('v-data')
        }
        
        // 对于 element 来进行指令的替换 v- : @开头的指令。
        for (let { name, value } of el.attributes) {
            if (directiveRe.test(name)) {
                applyDirective(el, name, value, ctx)
            }
        }
        
        let child = node.firstChild
        while (child) {
            process(child, ctx)
            child = child.nextSibling
        }
    } else if (node.nodeType === 3) {
        let data = (node as Text).data

        // 处理{{ msg }}
        if (data.includes('{{')) {
            // 非贪婪模式
            let lastIndex = 0
            let match

            let texts:string[] = []

            // js 正则的exec会一直循环匹配，每次都会返回一个符合条件的结果，直到返回null后循环。
            while ( match =  textRe.exec(data)) {
                // 这里添加两个值
                // 一个是 1 {{ msg }} 前面的1
                // 第二个是 msg
                texts.push(
                    JSON.stringify(data.slice(lastIndex, match.index)),
                    `(${match[1]})`
                )
                // 把游标放到匹配到的第一个{{}}之后。
                lastIndex = match.index + match[0].length
            }
            
            // 处理完的字符串是 "1" + msg  这样的，之后交给eval处理。
            text(node, ctx, texts.join('+'))
        }

    }

}