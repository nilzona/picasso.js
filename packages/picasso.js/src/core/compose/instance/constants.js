export const DEFAULT_LIFECYCLE = [
  'componentWillMount',
  'componentDidMount',
  'shouldComponentUpdate',
  'componentWillReceiveProps',
  'componentWillUpdate',
  'componentDidUpdate',
  'componentWillUnmount',
  'beforeRender'
];
export const LEGACY_LIFECYCLE = [
  'created',
  'beforeMount',
  'mounted',
  'beforeUnmount',
  'beforeUpdate',
  'updated',
  'beforeRender',
  'beforeDestroy',
  'destroyed'
];
export const DEFAULT_METHODS = [
  'render',
  'resize',
  'preferredSize',
  'preferredDimension',
  'layoutComponents',
  ...DEFAULT_LIFECYCLE,
  ...LEGACY_LIFECYCLE
];
