import { render } from 'preact';
import { synthesize, syntheticUpdate, syntheticDataUpdate } from './synthesize';
import createChartContext from './chart-context';

// function update(/* {  data, settings} */) {}

function getElementSize(element) {
  if (typeof element.getBoundingClientRect === 'function') {
    const { width, height } = element.getBoundingClientRect();
    return { width, height };
  }
  return { width: 0, height: 0 };
}

const compose = (userDefinition, globalContext) => {
  const { element } = userDefinition;
  const chartContext = createChartContext(globalContext, element);
  chartContext.update(userDefinition);

  let chartInstance = synthesize(userDefinition, globalContext, chartContext);
  chartContext.setRootInstance(chartInstance);

  const renderChart = () => {
    const { width, height } = getElementSize(element);
    chartInstance.resize({
      x: 0,
      y: 0,
      width,
      height,
    });
    chartInstance.reset();
    chartInstance.layoutComponents();
    // render chart with preact
    render(chartInstance.vdom, element);
  };

  const clearChart = () => {
    render(null, element, element.lastChild);
  };

  const chart = {};

  const update = updatedUserDefinition => {
    if (updatedUserDefinition) {
      chartContext.update(updatedUserDefinition);
      if (chartContext.isOnlyDataUpdate()) {
        syntheticDataUpdate(chartInstance);
      } else {
        syntheticUpdate(chartInstance, updatedUserDefinition, globalContext, chartContext);
      }
    }
    renderChart();
  };

  const destroy = () => {
    if (chartInstance) {
      // clean up
      clearChart();
      chartInstance.destroy();
      delete chart.update;
      chartInstance = null;
    }
  };

  renderChart();

  chart.update = update;
  chart.destroy = destroy;
  return chart;
};

export default compose;
