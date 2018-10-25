import extend from 'extend';
import { DEFAULT_METHODS } from './constants';
import { linkFunction, linkGetter } from './link';
import createRendererBox from '../rendering/renderer-box';

const createInstances = (userDef, { registries }) => {
  let componentDef;
  let type = userDef.type || 'layout'; // default to layout component if undefined
  componentDef = registries.component(type);
  // set defaults
  const userSettings = extend(
    true,
    { show: true },
    componentDef.defaultSettings,
    userDef
  );
  userSettings.type = type;

  const userInstance = extend({}, userSettings);
  const componentInstance = extend({}, componentDef);

  return {
    userSettings,
    userInstance,
    componentInstance
  };
};

const create = (userDef, context) => {
  const { userSettings, userInstance, componentInstance } = createInstances(
    userDef,
    context
  );

  const children = [];
  const instance = {};

  // add public methods
  DEFAULT_METHODS.forEach(fnName => linkFunction(fnName, {
    source: [userInstance, componentInstance],
    target: instance
  }));

  // add internal api
  instance.addChild = c => children.push(c);
  instance.getChildren = () => children;
  instance.visible = true;

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
        return userSettings;
      }
    }
  });
  // expose getters both on user and component instance
  ['rect', 'visible'].forEach(propName => linkGetter(propName, {
    source: instance,
    target: [userInstance, componentInstance]
  }));
  // expose getters only on component instance
  ['getChildren', 'userSettings'].forEach(propName => linkGetter(propName, {
    source: instance,
    target: componentInstance
  }));

  const requireMap = {
    registries: context.registries
  };
  const linkRequire = (sattelite) => {
    let { require = [] } = sattelite;
    require.forEach((req) => {
      if (requireMap[req]) {
        linkGetter(req, { target: sattelite }, requireMap[req]);
      }
    });
  };
  linkRequire(componentInstance);
  linkRequire(userInstance);

  instance.created();

  return instance;
};

export default create;
