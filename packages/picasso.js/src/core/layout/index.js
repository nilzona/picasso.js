import registry from '../utils/registry';
import dockLayout from './dock';
import gridLayout from './grid';
import componentRegistry from '../component';

const layoutComponent = {
  preferredSize() {
    let size = 0;
    for (const child of this.getChildren()) {
      size += child.preferredSize() || 0;
    }
    return size;
  },
  preferredDimension() {
    let dim = { w: 0, h: 0 };
    for (const child of this.getChildren()) {
      const { w, h } = child.preferredDimension() || { w: 0, h: 0 };
      dim.w += w;
      dim.h += h;
    }
    return dim;
  }
};
componentRegistry('layout', layoutComponent);
const layoutRegistry = registry();
layoutRegistry('dock', dockLayout);
layoutRegistry('grid', gridLayout);

export default layoutRegistry;
