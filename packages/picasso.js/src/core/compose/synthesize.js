import { h } from 'preact';

import ChartComponent from './component';

function synthesize(definition, root) {
  definition.components = definition.components || [];

  let children = [];
  definition.components.forEach((componentDefinition) => {
    children.push(synthesize(componentDefinition, root));
  });

  return (
    <ChartComponent definition={definition} root={root}>{children.length ? children : null}</ChartComponent>
  );
}

export default synthesize;
