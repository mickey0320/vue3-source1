export let activeEffect = undefined;

class ReactiveEffect {
  public active = true;
  public parent = undefined;
  public deps = [];
  constructor(public fn) {}
  run() {
    if (!this.active) {
      return this.fn();
    } else {
      try {
        this.parent = activeEffect;
        activeEffect = this;
        return this.fn();
      } finally {
        activeEffect = this.parent;
        this.parent = null;
      }
    }
  }
}
export function effect(fn) {
  const _effect = new ReactiveEffect(fn);

  return _effect.run();
}
