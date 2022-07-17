import { isObject } from "@vue/shared";
import baseHandler from "./baseHandler";
import { activeEffect } from "./effect";

const reactiveMap = new WeakMap();
const targetMap = new WeakMap();

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

export function track(target, key) {
  if (activeEffect) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, (depsMap = new Map()));
    }
    let deps = depsMap.get(key);
    if (!deps) {
      depsMap.set(key, (deps = new Set()));
    }
    const shouldTrack = !deps.has(activeEffect);
    if (shouldTrack) {
      deps.add(activeEffect);
      activeEffect.deps.push(deps);
    }
  }
}

export function trigger(target, key, value) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }
  const effects = depsMap.get(key);
  effects?.forEach((effect) => {
    if (activeEffect !== effect) {
      effect.run();
    }
  });
}
