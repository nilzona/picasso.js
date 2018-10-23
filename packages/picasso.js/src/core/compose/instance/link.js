export function linkFunction(fnName, { source, target }) {
  if (!Array.isArray(source)) {
    source = [source];
  }
  if (!Array.isArray(target)) {
    target = [target];
  }
  target.forEach((t) => {
    t[fnName] = (...args) => {
      for (let i = 0; i < source.length; ++i) {
        if (typeof source[i][fnName] === 'function') {
          return source[i][fnName].call(source[i], ...args);
        }
      }
      return undefined;
    };
  });
}

export function linkGetter(propName, { source, target }, value) {
  if (!Array.isArray(source)) {
    source = [source];
  }
  if (!Array.isArray(target)) {
    target = [target];
  }
  target.forEach((t) => {
    if (value) {
      Object.defineProperty(t, propName, {
        get() {
          return value;
        }
      });
    } else {
      source.forEach((s) => {
        if (s[propName]) {
          Object.defineProperty(t, propName, {
            get() {
              return s[propName];
            }
          });
        }
      });
    }
  });
}
