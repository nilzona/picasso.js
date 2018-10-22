import symbolFactory from '../../../symbols';

const apply = ({ registries, style }, currInstance) => {
  const { require = [] } = currInstance;
  const renderer = registries.renderer()(); // TODO:
  const depMap = {
    renderer: () => renderer,
    symbol: () => symbolFactory,
    registries: () => registries,
    style: () => style
  };
  Object.keys(require).reduce((acc, curr) => {
    if (depMap[curr]) {
      acc[curr] = depMap[curr];
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
