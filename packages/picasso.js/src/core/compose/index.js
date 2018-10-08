import { render } from 'preact';
import extend from 'extend';
import synthesize from './synthesize';

import componentRegistry from '../component';

const rootComponent = {};
componentRegistry('root', rootComponent);

function updateChart(/* {  data, settings} */) {

}

function compose(composeDefinition, context) {
  const { element, data, settings } = composeDefinition;
  composeDefinition.type = 'root';
  const root = extend({ element, data }, settings);
  root.update = updateChart;

  const vdom = synthesize(root, context, root);

  render(vdom, element);
  return root;
}

export default compose;
