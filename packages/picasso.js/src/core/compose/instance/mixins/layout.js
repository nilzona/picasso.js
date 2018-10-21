export default function layout({ depth, children, instance }) {
  instance.depth = depth;
  instance.addChild = c => children.push(c);
  instance.getChildren = () => children;
  instance.layoutComponents = () => {
    instance.layoutComponent();
    children.forEach((child) => {
      if (child.strategy) {
        child.layoutComponents();
      }
    });
  };
  instance.layoutComponent = () => {
    throw new Error('Layout strategy needs to implement `layoutComponent`');
  };
  return instance;
}
