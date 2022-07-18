import { isObject } from "@vue/shared";
import baseHandler from "./baseHandler";

const reactiveMap = new WeakMap();

export enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
}

export function reactive(obj) {
  if (!isObject(obj)) {
    return obj;
  }
  if (obj[ReactiveFlags.IS_REACTIVE]) {
    return obj;
  }
  const existing = reactiveMap.get(obj);
  if (existing) {
    return existing;
  }

  const proxy = new Proxy(obj, baseHandler);
  reactiveMap.set(obj, proxy);

  return proxy;
}
