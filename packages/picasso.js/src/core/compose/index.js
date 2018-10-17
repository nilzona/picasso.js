import { render } from 'preact';
import extend from 'extend';
import synthesize from './synthesize';

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

function update(/* {  data, settings} */) {}

function compose(composeDefinition, context) {
  const { element, data, settings } = composeDefinition;
  const rootInstance = extend(
    {
      element,
      data,
      update,
      type: 'layout'
    },
    settings
  );

  const { instance, vdom } = synthesize(rootInstance, context);

  instance.layoutComponents();

  render(vdom, element);
  return rootInstance;
}

export default compose;
