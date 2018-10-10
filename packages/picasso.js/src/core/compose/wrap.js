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

const otherMethods = [
  'resize',
  'preferredSize'
];

const methods = [...lifeCycle, ...otherMethods];

const wrap = (userDef, context) => {
  const { registries } = context;
  if (!userDef.type && userDef.components) {
    // assume layout type
    userDef.type = 'layout';
  }
  const componentDef = registries.component(userDef.type);
  const userInstance = extend({}, userDef);
  const componentInstance = extend({}, componentDef);
  const keys = [...new Set([...methods, ...Object.keys(componentInstance), ...Object.keys(userInstance)])];
  const wrappedInstance = {
    __children__: [],
    __addChild(c) {
      this.__children__.push(c);
    },
    _getChildren() {
      return this.__children__;
    },
    layoutComponents() {
      // set sizes here - and move this to a nicer place
    },
    setRect(r) {
      this.setProp('rect', r);
    },
    setProp(prop, value) {
      Object.defineProperty(userInstance, prop, {
        value
      });
      Object.defineProperty(componentInstance, prop, {
        value
      });
    }
  };
  keys.reduce((acc, curr) => {
    const userType = typeof userInstance[curr];
    const componentType = typeof componentInstance[curr];
    if (userType !== 'undefined' && componentType !== 'undefined' && userType !== componentType) {
      throw new Error(`Inconsistency userType:${userType} componentType:${componentType}`);
    }
    if (methods.indexOf(curr) > -1 || userType === 'function' || componentType === 'function') {
      acc[curr] = (...args) => {
        if (typeof userInstance[curr] === 'function') {
          return userInstance[curr].call(userInstance, ...args);
        }
        if (typeof componentInstance[curr] === 'function') {
          return componentInstance[curr].call(componentInstance, ...args);
        }
        return undefined;
      };
    } else {
      acc[curr] = userInstance[curr] || componentInstance[curr];
    }
    return acc;
  }, wrappedInstance);
  return wrappedInstance;
};

export default wrap;
