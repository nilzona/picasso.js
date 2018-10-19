export default function applySetterGetter({
  userInstance,
  componentInstance,
  instance,
  props
}) {
  // apply setter getter props
  return props.reduce((acc, curr) => {
    const prop = `__${curr}`;
    Object.defineProperty(acc, curr, {
      get() {
        return this[prop];
      },
      set(newVal) {
        this[prop] = newVal;
        componentInstance[curr] = newVal;
        userInstance[curr] = newVal;
      }
    });
    return acc;
  }, instance);
}
