import { render } from 'preact';
import { synthesize, syntheticupdate, syntheticDataUpdate } from './synthesize';
import createToolbox from './toolbox';

// function update(/* {  data, settings} */) {}

function getElementSize(element) {
  if (typeof element.getBoundingClientRect === 'function') {
    const { width, height } = element.getBoundingClientRect();
    return { width, height };
  }
  return { width: 0, height: 0 };
}

const compose = (userDefinition, context) => {
  let { element } = userDefinition;
  const toolbox = createToolbox(context);
  toolbox.update(userDefinition);

  const chart = synthesize(userDefinition, context, toolbox);

  const renderChart = () => {
    const { width, height } = getElementSize(element);
    chart.rect = {
      x: 0,
      y: 0,
      width,
      height
    };
    chart.layoutComponents(userDefinition.strategy);
    // render chart with preact
    render(chart.vdom, element, element.lastChild);
  };

  const update = (updatedUserDefinition) => {
    toolbox.update(updatedUserDefinition);
    if (toolbox.isOnlyDataUpdate()) {
      syntheticDataUpdate(chart);
    } else {
      syntheticupdate(chart, updatedUserDefinition, context, toolbox);
    }
    renderChart();
  };

  renderChart();
  return { update };
};

export default compose;
