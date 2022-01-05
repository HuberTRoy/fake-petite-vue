import { evalValue } from "@/eval";
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

const insertAfter = (newNode: Node, referrenceNode: Node) => {
  const parent = referrenceNode.parentElement;
  parent?.insertBefore(newNode, referrenceNode.nextSibling);
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
  let prevListNode = new Map<string, Node>();
  let currentListNode = new Map<string, Node>();
  let childScope: context[] = [];

  let usedKeys: string[] = [];
  let deleteKeys: string[] = [];

  // let prevKey: string = "";

  let containerList = ctx.scope[container];

  observe(() => {
    usedKeys = [];
    childScope = [];
    currentListNode.clear();
    let keys = [...prevListNode.keys()];
    // 这里先分成两步
    // 1. 迭代一次，生成一份新的当前node的数组。
    // 2. 迭代第二次，第二次迭代1的结果，结果中进行以下步骤：
    //    2.1 进行比对，比对是否是同一个节点，当前仅以Key为对比条件。key相同且顺序相同则不变。
    //    2.2 key相同但顺序不同，eg 翻转，此时应该移动。
    //    2.3 key不同在当前节点新插入新的节点。
    for (let [index, item] of containerList.entries()) {
      let copyCtx = cloneDeep(ctx);
      copyCtx.scope[itemName] = item;
      childScope.push(copyCtx);
      let key = el.getAttribute(":key") || "";
      if (key) {
        key = evalValue(copyCtx.scope, key);
      }
      // let last = prevListNode.get(prevKey) || anchor;
      let clone = prevListNode.get(key);
      if (!clone) {
        clone = el.cloneNode(true);
        process(clone, copyCtx);
      }
      currentListNode.set(key, clone);
      usedKeys.push(key);

      // 这里在与prevListNode的keys取差集，得出的结果需要删除掉。
      // 这地方其实应该用O(1)的查询，先不管。
      deleteKeys = [...prevListNode.keys()].filter(x => !usedKeys.includes(x));
    }

    let last: Node | Text = anchor;
    for (let [mapIndex, mapKey] of [...currentListNode.keys()].entries()) {
      let curNode = currentListNode.get(mapKey) as Node;
      let preNode = prevListNode.get(keys[mapIndex]);

      if (!preNode) {
        // 一个崭新的节点
        insertAfter(curNode, last);
      } else if (preNode !== curNode) {
        // 有旧节点，但顺序不同，这时候应该把原来的在当前位置的节点删除然后添加新的进去
        insertAfter(curNode, last);
      } else {
        // 这里预留，不变的情况下还需要有一些更加丰富的判断才能完全判定为不变，当前只判断了key。
      }
      last = curNode;
    }

    while (deleteKeys.length) {
      let key: string | undefined = deleteKeys.pop();
      if (key) {
        let node: Node | undefined = prevListNode.get(key);
        if (node) {
          removeNode(node);
          prevListNode.delete(key);
        }
      }
    }
    prevListNode = cloneDeep(currentListNode);

    delete ctx.scope[itemName];
  });
};
