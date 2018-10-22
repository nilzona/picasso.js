import symbolFactory from '../../../symbols';

const apply = ({ registries, style, renderer }, currInstance) => {
  const { require = [] } = currInstance;
  const useRenderer = currInstance.renderer
    ? registries.renderer(currInstance.renderer)()
    : renderer || registries.renderer()();
  const depMap = {
    renderer: () => useRenderer,
    symbol: () => symbolFactory,
    registries: () => registries,
    style: () => style
  };
  Object.keys(require).reduce((acc, curr) => {
    if (depMap[curr]) {
      Object.defineProperty(acc, curr, {
        get: depMap[curr]
      });
    }
    return acc;
  }, currInstance);
};

const applyDeps = ({
  userInstance, componentInstance, instance, context
}) => {
  [userInstance, componentInstance].forEach(currInstance => apply(context, currInstance));
  return instance;
};

export default applyDeps;
