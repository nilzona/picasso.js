import { render } from 'preact';
import extend from 'extend';
import synthesize from './synthesize';

function updateChart(/* {  data, settings} */) {

}

function compose(definition) {
  const root = extend({}, definition);
  root.update = updateChart;

  const vdom = synthesize(definition, root);

  render(vdom, definition.element);
  return root;
}

export default compose;
