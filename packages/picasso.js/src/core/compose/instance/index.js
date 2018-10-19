import extend from 'extend';
import mixins from './mixins';

import {
  DEFAULT_METHODS,
  DEFAULT_RESERVED_KEYS,
  DEFAULT_SETTER_GETTER_PROPS
} from './contants';

const createInstances = (userDef, { registries }) => {
  let componentDef;
  if (userDef.strategy) {
    const strategy = userDef.strategy || {};
    const { type = 'dock', ...settings } = strategy;
    componentDef = registries.layout(type)(settings || {});
  } else {
    componentDef = registries.component(userDef.type);
  }
  const userInstance = extend({}, userDef);
  const componentInstance = extend({}, componentDef);

  return {
    userInstance,
    componentInstance
  };
};

const create = (userDef, context, depth) => {
  const { userInstance, componentInstance } = createInstances(userDef, context);

  // create combined keys
  const DEFAULT_KEYS = [
    ...DEFAULT_METHODS,
    ...Object.keys(componentInstance),
    ...Object.keys(userInstance).filter(
      key => DEFAULT_RESERVED_KEYS.indexOf(key) === -1
    )
  ];

  const children = [];

  // apply internal api add keys to `reservedKeys`so user can't override them
  const instance = {
    depth,
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

  return mixins.reduce(
    (acc, curr) => curr({
      userDef,
      userInstance,
      componentInstance,
      instance: acc,
      props: DEFAULT_SETTER_GETTER_PROPS,
      keys: DEFAULT_KEYS,
      children,
      DEFAULT_METHODS,
      DEFAULT_RESERVED_KEYS
    }),
    instance
  );
};

export default create;
