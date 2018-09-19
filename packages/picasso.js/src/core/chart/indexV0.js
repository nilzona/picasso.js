import { h, render } from 'preact';
import themeFn from '../theme';
import synthesize from './synthesize';

function updateChart({ data, settings}) {

}

function chartFn(definition, context) {

  let {
    element,
    data = [],
    settings = {}
  } = definition;

  const { registries, logger } = context;
  const theme = themeFn(context.style, context.palettes);

  const instance = {};

  instance.update = updateChart;
  const components = synthesize(definition, context);

  render(<div>{}</div>)
  return instance;
}

export default chartFn;
