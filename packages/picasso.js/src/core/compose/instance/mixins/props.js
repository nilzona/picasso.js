const applyProps = ({
  userDef,
  userInstance,
  componentInstance,
  instance,
  keys,
  children,
  DEFAULT_METHODS,
  DEFAULT_RESERVED_KEYS
}) => keys.reduce((acc, curr) => {
  const userType = typeof userInstance[curr];
  const componentType = typeof componentInstance[curr];
  if (
    userType !== 'undefined'
      && componentType !== 'undefined'
      && userType !== componentType
  ) {
    throw new Error(
      `Inconsistency userType:${userType} componentType:${componentType}`
    );
  }
  if (
    DEFAULT_METHODS.indexOf(curr) > -1
      || userType === 'function'
      || componentType === 'function'
  ) {
    acc[curr] = (...args) => {
      if (
        DEFAULT_RESERVED_KEYS.indexOf(curr) === -1
          && typeof userInstance[curr] === 'function'
      ) {
        return userInstance[curr].call(userInstance, ...args);
      }
      if (typeof componentInstance[curr] === 'function') {
        if (userDef.strategy) {
          componentInstance.getChildren = () => children;
        }
        return componentInstance[curr].call(componentInstance, ...args);
      }
      return undefined;
    };
  } else {
    acc[curr] = userInstance[curr] || componentInstance[curr];
  }
  return acc;
}, instance);
export default applyProps;
