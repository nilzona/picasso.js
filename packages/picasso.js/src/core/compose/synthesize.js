import { h } from 'preact';

import ChartComponent from './component';

function synthesize(definition, context, chartInstance) {
  definition.components = definition.components || [];

  let children = [];
  definition.components.forEach((c) => {
    children.push(synthesize(c, context, chartInstance));
  });

  return (
    <ChartComponent definition={definition} context={context} chart={chartInstance}>{children.length ? children : null}</ChartComponent>
  );
}

export default synthesize;
