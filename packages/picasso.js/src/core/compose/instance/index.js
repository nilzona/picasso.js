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

  // create combined keys
  const keys = [
    ...DEFAULT_METHODS,
    ...Object.keys(componentInstance),
    ...Object.keys(userInstance).filter(
      key => DEFAULT_RESERVED_KEYS.indexOf(key) === -1
    )
  ];

  return {
    userInstance,
    componentInstance,
    keys
  };
};

const create = (userDef, context, depth) => {
  const { userInstance, componentInstance, keys } = createInstances(
    userDef,
    context
  );

  const children = [];
  const instance = {};

  return mixins.reduce(
    (acc, curr) => curr({
      userDef,
      userInstance,
      componentInstance,
      depth,
      instance: acc,
      props: DEFAULT_SETTER_GETTER_PROPS,
      keys,
      children,
      DEFAULT_METHODS,
      DEFAULT_RESERVED_KEYS,
      context
    }),
    instance
  );
};

export default create;
