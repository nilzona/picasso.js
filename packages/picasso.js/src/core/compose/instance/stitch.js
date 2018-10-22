export function stitchFunction(fnName, { source, target }) {
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

export function stitchGetter(propName, { source, target }) {
  if (!Array.isArray(source)) {
    source = [source];
  }
  if (!Array.isArray(target)) {
    target = [target];
  }
  target.forEach((t) => {
    source.forEach((s) => {
      Object.defineProperty(t, propName, {
        get() {
          return s[propName];
        }
      });
    });
  });
}

export function stitchDeps() {
  // add deps herea
}
