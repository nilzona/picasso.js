import extend from 'extend';
import { DEFAULT_METHODS } from './constants';
import { linkFunction, linkGetter } from './link';
import createRendererBox from '../rendering/renderer-box';
import prepareRenderingContext from './rendering-context';

const createInstances = (userDef, { registries }) => {
  let componentDef;
  let type = userDef.type || 'layout'; // default to layout component if undefined
  componentDef = registries.component(type) || {};
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

const create = (userDef, globalContext, toolbox) => {
  let { userSettings, userInstance, componentInstance } = createInstances(
    userDef,
    globalContext
  );

  const children = [];
  const instance = {};

  // internal api for a component instance

  /**
   * Adds sub-component to this component, use index to decide the placement
   */
  instance.addChild = (c, index) => {
    if (typeof index === 'undefined') {
      children.push(c);
    } else {
      children.splice(index, 0, c);
    }
  };

  /**
   * Gets sub-components from this component
   * @returns {Array} sub-components
   */
  instance.getChildren = () => children;

  instance.getPreferredSize = () => ({ width: 0, height: 0 }); // auto size

  instance.update = (newUserDef) => {
    if (!toolbox.isOnlyDataUpdate()) {
      userSettings = extend(
        true,
        componentInstance.defaultSettings,
        newUserDef
      );
    }
    instance.ctx = prepareRenderingContext({
      globalContext,
      instance,
      toolbox
    });
  };

  instance.visible = true;
  // add internal getters
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

  // link "public" methods from sattelites to base
  DEFAULT_METHODS.forEach(fnName => linkFunction(fnName, {
    source: [userInstance, componentInstance],
    target: instance
  }));

  // link getters from base to both sattelites
  ['rect', 'visible'].forEach(propName => linkGetter(propName, {
    source: instance,
    target: [userInstance, componentInstance]
  }));
  // link getters from base only to component instance
  ['getChildren', 'userSettings'].forEach(propName => linkGetter(propName, {
    source: instance,
    target: componentInstance
  }));
  // link getters from base only to user sattelite
  ['key'].forEach(propName => linkGetter(propName, {
    source: instance,
    target: userInstance
  }));

  // link required properties from base to sattelites
  const linkRequire = (satteliteInstance) => {
    let { require = [] } = satteliteInstance;
    require.forEach((req) => {
      if (toolbox[req]) {
        linkGetter(req, { target: satteliteInstance }, toolbox[req]);
      }
    });
  };
  linkRequire(componentInstance);
  linkRequire(userInstance);

  instance.ctx = prepareRenderingContext({
    globalContext,
    instance,
    toolbox
  });

  instance.created();

  return instance;
};

export default create;
