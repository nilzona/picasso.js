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

const reservedKeys = [
  'layoutComponents',
  'layoutComponent',
  ...props,
  '__depth',
  'isRoot',
  'addChild',
  'getChildren'
];

const createInstances = (userDef, { registries }) => {
  let componentDef;
  if (userDef.strategy) {
    const strategy = userDef.strategy || {};
    const { type = 'dock', ...settings } = strategy;
    componentDef = registries.layout(type)(settings || {});
  } else {
    componentDef = registries.component(userDef.type);
  }
  const userInstance = extend(true, {}, userDef);
  const componentInstance = extend(true, {}, componentDef);

  return {
    userInstance,
    componentInstance
  };
};

const create = (userDef, context, depth) => {
  const { userInstance, componentInstance } = createInstances(userDef, context);

  // create a unique set of combined keys
  const keys = [
    ...new Set([
      ...methods,
      ...Object.keys(componentInstance),
      ...Object.keys(userInstance).filter(
        key => reservedKeys.indexOf(key) === -1
      )
    ])
  ];

  const children = [];

  // apply internal api add keys to `reservedKeys`so user can't override them
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
      this.layoutComponent();
      this.getChildren().forEach((child) => {
        if (child.strategy) {
          child.layoutComponents();
        }
      });
    },
    layoutComponent() {
      throw new Error('Layout strategy needs to implement `layoutComponent`');
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
        if (
          reservedKeys.indexOf(curr) === -1
          && typeof userInstance[curr] === 'function'
        ) {
          return userInstance[curr].call(userInstance, ...args);
        }
        if (typeof componentInstance[curr] === 'function') {
          return componentInstance[curr].call(
            {
              ...componentInstance,
              ...(userDef.strategy
                ? {
                  getChildren() {
                    return children;
                  }
                }
                : {})
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
