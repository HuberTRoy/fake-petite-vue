import { Directive } from ".";
import { evalValue } from "@/eval";
import { observe } from "@/observable";

export const model: Directive = ({ el, value, ctx, get }) => {
  // v-model 实现双向绑定。
  // 对于input，select，radio等元素添加onInput事件，事件触发时改变绑定的值，值改变后触发回调。
  // 先只做input。
  if (el.nodeName === "INPUT") {
    el.addEventListener("input", event => {
      if (!event) {
        return;
      }
      const target = event.target as HTMLInputElement;
      const newVal = target.value;
      evalValue(ctx.scope, `${value} = "${newVal}"`, ctx.childrenScope || {});
    });
  }

  observe(() => {
    if (el.nodeName === "INPUT") {
      (el as HTMLInputElement).value = get();
    }
  });
};
