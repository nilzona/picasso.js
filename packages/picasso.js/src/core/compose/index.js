import { render } from 'preact';
import extend from 'extend';
// import themeFn from '../theme';
import synthesize from './synthesize';

function updateChart(/* {  data, settings} */) {

}

function compose(definition) {
  const {
    element,
    data = [],
    settings = {},
    context
  } = definition;
  // const { registries, logger } = context;
  // const theme = themeFn(context.style, context.palettes);

  const instance = extend({}, definition);
  instance.update = updateChart;

  const vdom = synthesize(settings, context, instance);

  render(vdom, element);
  return instance;
}

export default compose;
