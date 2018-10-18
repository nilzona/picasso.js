import extend from 'extend';

const lifeCycle = [
  'componentWillMount',
  'componentDidMount',
  'shouldComponentUpdate',
  'componentWillReceiveProps',
  'componentWillUpdate',
  'componentDidUpdate',
  'componentWillUnmount',
  'beforeRender'
];

const otherMethods = ['resize', 'preferredSize', 'preferredDimension'];

const props = ['rect'];

const methods = [...lifeCycle, ...otherMethods];

const create = (userDef, context, depth) => {
  const { registries } = context;
  if (!userDef.type && userDef.components) {
    // assume layout type
    userDef.type = 'layout';
  }

  const componentDef = registries.component(userDef.type);
  const userInstance = extend(true, {}, userDef);
  const componentInstance = extend(true, {}, componentDef);

  // create a unique set of combined keys
  const keys = [
    ...new Set([
      ...methods,
      ...Object.keys(componentInstance),
      ...Object.keys(userInstance)
    ])
  ];

  const children = [];

  // apply internal api
  const instance = {
    __depth: depth,
    isRoot: depth === 0,
    addChild(c) {
      children.push(c);
    },
    getChildren() {
      return children;
    },
    layoutComponents() {
      const strategyDef = this.strategy || {};
      const { type = 'dock', ...settings } = strategyDef;
      const strategy = registries.layout(type)(settings || {});
      strategy.layout(this);

      this.getChildren().forEach((child) => {
        if (child.type === 'layout') {
          child.layoutComponents();
        }
      });
    }
  };

  // apply predefined props
  props.reduce((acc, curr) => {
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
    return instance;
  }, instance);

  // apply methods and props
  keys.reduce((acc, curr) => {
    const userType = typeof userInstance[curr];
    const componentType = typeof componentInstance[curr];
    if (
      userType !== 'undefined'
      && componentType !== 'undefined'
      && userType !== componentType
    ) {
      throw new Error(
        `Inconsistency userType:${userType} componentType:${componentType}`
      );
    }
    if (
      methods.indexOf(curr) > -1
      || userType === 'function'
      || componentType === 'function'
    ) {
      acc[curr] = (...args) => {
        if (typeof userInstance[curr] === 'function') {
          return userInstance[curr].call(userInstance, ...args);
        }
        if (typeof componentInstance[curr] === 'function') {
          return componentInstance[curr].call(
            {
              ...componentInstance,
              getChildren() {
                return children;
              }
            },
            ...args
          );
        }
        return undefined;
      };
    } else {
      acc[curr] = userInstance[curr] || componentInstance[curr];
    }
    return acc;
  }, instance);

  return instance;
};

export { methods, props };
export default create;
