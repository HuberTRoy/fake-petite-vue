import { context } from "./app";

export function evalValue(ctx: any, texts: string, childrenScope: any = {}) {
  const fn = (ctx: context) => {
    // 最终还是用了with，
    // 否则需要实现整套语法树逻辑。
    return new Function(
      `__ctx`,
      `__childScope`,
      `with (__ctx) { with(__childScope) { return (${texts}) } }`
    )(ctx, childrenScope);
  };

  return fn(ctx);
}
