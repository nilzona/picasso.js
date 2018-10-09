import { h } from 'preact';
import extend from 'extend';
import ChartComponent from './ChartComponent';


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
  'resize'
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
    layoutComponents() {
      // set sizes here - and move this to a nicer place
    },
    setRect(r) {
      userInstance.rect = r;
      componentInstance.rect = r;
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

function synthesize(userDef, context) {
  userDef.components = userDef.components || [];
  let children = [];
  const instance = wrap(userDef, context);

  userDef.components.forEach((subComponentUserDef) => {
    const oneLevelDeeper = synthesize(subComponentUserDef, context, instance);
    instance.__addChild(oneLevelDeeper.instance);
    children.push(oneLevelDeeper.vdom);
  });
  return {
    vdom: <ChartComponent instance={instance} context={context}>{children}</ChartComponent>,
    instance
  };
}

export default synthesize;
