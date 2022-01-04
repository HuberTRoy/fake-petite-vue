import { context } from "./../app";
import { observe } from "@/observable";
import { process } from "@/process";
// import { Block } from "./block";
import { Directive } from ".";
import { cloneDeep } from "lodash";

// interface childScope {

// }

const removeNode = (node: Node) => {
  const parent = node.parentElement;
  parent?.removeChild(node);
};

export const _for: Directive = ({ el, value, ctx, get }) => {
  // 这里的for与实际还有极大的差距。
  const itemName: string = value.split("in")[0].trim();
  const container: any = value.split("in")[1].trim();
  el.removeAttribute("v-for");
  const parent = el.parentElement;
  const anchor = new Text("");
  parent?.insertBefore(anchor, el);
  parent?.removeChild(el);
  let prevListNode: Node[] = [];
  let childScope: context[] = [];

  observe(() => {
    while (prevListNode.length) {
      let node: Node = prevListNode.pop() as Node;
      removeNode(node);
    }
    prevListNode = [];
    childScope = [];

    for (let item of ctx.scope[container]) {
      let last = prevListNode[prevListNode.length] || anchor;
      let clone = el.cloneNode(true);
      let copyCtx = cloneDeep(ctx);
      copyCtx.scope[itemName] = item;
      childScope.push(copyCtx);
      process(clone, copyCtx);
      parent?.insertBefore(clone, last);
      prevListNode.push(clone);
    }

    delete ctx.scope[itemName];
  });
};
