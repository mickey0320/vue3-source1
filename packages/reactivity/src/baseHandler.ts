import { activeEffect } from "./effect";
import { ReactiveFlags, track, trigger } from "./reactive";

const baseHandler = {
  get(target, key, receiver) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return target;
    }
    track(target, key);
    return Reflect.get(target, key, receiver);
  },
  set(target, key, value, receiver) {
    const oldValue = target[key];

    if (oldValue !== value) {
      const result = Reflect.set(target, key, value, receiver);
      trigger(target, key, value);

      return result;
    }
  },
};

export default baseHandler;
