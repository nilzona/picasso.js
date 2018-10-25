export const DEFAULT_LIFECYCLE = [
  'componentWillMount',
  'componentDidMount',
  'shouldComponentUpdate',
  'componentWillReceiveProps',
  'componentWillUpdate',
  'componentDidUpdate',
  'componentWillUnmount'
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
  'getPreferredSize',
  'layoutComponents',
  ...DEFAULT_LIFECYCLE,
  ...LEGACY_LIFECYCLE
];
