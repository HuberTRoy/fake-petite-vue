import { observe } from "@/observable";
import { Directive } from ".";

export const _if: Directive<HTMLElement> = ({ el, get }) => {
  // const initialDisplay = el.style.display
  let isAttached = true;
  let parent = el.parentNode;
  let cm = new Comment("v-if");

  observe(() => {
    let state = get();
    if (state) {
      if (!isAttached) {
        parent?.insertBefore(el, cm);
        parent?.removeChild(cm);
        isAttached = true;
      }
    } else {
      // 这里会把一个注释插入到实际应该是v-if的位置，后续如果条件是true，在把这个node根据注释插回去。
      parent?.insertBefore(cm, el);
      parent?.removeChild(el);
      isAttached = false;
    }
  });
};
