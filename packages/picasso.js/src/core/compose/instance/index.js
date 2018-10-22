import extend from 'extend';
import { DEFAULT_METHODS } from './constants';
import { stitchFunction, stitchGetter } from './stitch';
import createRendererBox from '../rendering/renderer-box';

const createInstances = (userDef, { registries }) => {
  let componentDef;
  if (!userDef.type && userDef.components && userDef.components.length) {
    // assume layout component
    userDef.type = 'layout';
  }
  componentDef = registries.component(userDef.type);

  const userInstance = extend({}, userDef);
  const componentInstance = extend({}, componentDef);

  return {
    userInstance,
    componentInstance
  };
};

const create = (userDef, context) => {
  const { userInstance, componentInstance } = createInstances(userDef, context);

  const children = [];
  const instance = {};

  // add public methods
  DEFAULT_METHODS.forEach(fnName => stitchFunction(fnName, {
    source: [userInstance, componentInstance],
    target: instance
  }));

  // add internal api
  instance.addChild = c => children.push(c);
  instance.getChildren = () => children;

  let rect = createRendererBox();
  Object.defineProperties(instance, {
    rect: {
      get() {
        return rect;
      },
      set(value) {
        rect = createRendererBox(value);
      }
    },
    userSettings: {
      get() {
        return userDef;
      }
    }
  });
  // expose getters both on user and component instance
  stitchGetter('rect', {
    source: instance,
    target: [userInstance, componentInstance]
  });
  // expose getters only on component instance
  ['getChildren', 'userSettings'].forEach(propName => stitchGetter(propName, {
    source: instance,
    target: componentInstance
  }));

  return instance;
};

export default create;
