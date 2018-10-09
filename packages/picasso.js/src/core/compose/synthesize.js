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
const wrap = (userDef, context) => {
  const { registries, ctxRenderer } = context;
  const componentDef = registries.component(userDef.type);
  const userInstance = extend({}, userDef);
  const componentInstance = extend({}, componentDef);
  const renderer = ctxRenderer || registries.renderer(userInstance.renderer || componentInstance.renderer)();
  const keys = [...new Set([...lifeCycle, ...otherMethods, ...Object.keys(componentInstance), ...Object.keys(userInstance)])];
  const wrappedInstance = {
    __children__: [],
    __addChild(c) {
      this.__children__.push(c);
    }
  };
  keys.reduce((acc, curr) => {
    acc[curr] = (...args) => {
      if (typeof userInstance[curr] === 'function') {
        return userInstance[curr].call(userInstance, args);
      }
      if (typeof componentInstance[curr] === 'function') {
        return componentInstance[curr].call(componentInstance, args);
      }
      return undefined;
    };
    return acc;
  }, wrappedInstance);
  return {
    wrappedInstance,
    renderer
  };
};

const wrapComponent = (wrappedInstance, renderer, children) => (
  <ChartComponent wrappedInstance={wrappedInstance} renderer={renderer} >{children}</ChartComponent>
);

function synthesize(userDef, context, parentWrappedInstance) {
  userDef.components = userDef.components || [];
  const { wrappedInstance, renderer } = wrap(userDef, context);
  parentWrappedInstance.__addChild(wrappedInstance);
  const children = userDef.components.reduce((acc, childUserDef) => [...acc, synthesize(childUserDef, context, wrappedInstance)], []);
  return wrapComponent(wrappedInstance, renderer, children);
}
export { wrap };
export default synthesize;
