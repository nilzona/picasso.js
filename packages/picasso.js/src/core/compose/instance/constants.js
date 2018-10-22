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
export const DEFAULT_METHODS = [
  'resize',
  'preferredSize',
  'preferredDimension',
  ...DEFAULT_LIFECYCLE
];
export const DEFAULT_SETTER_GETTER_PROPS = ['rect'];
export const DEFAULT_RESERVED_KEYS = [
  'layoutComponents',
  'layoutComponent',
  ...DEFAULT_SETTER_GETTER_PROPS,
  'depth',
  'addChild',
  'getChildren'
];
