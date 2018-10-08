import { h } from 'preact';

import ChartComponent from './component';

function synthesize(definition, context, root) {
  definition.components = definition.components || [];

  let children = [];
  definition.components.forEach((componentDefinition) => {
    children.push(synthesize(componentDefinition, context, root));
  });

  return (
    <ChartComponent definition={definition} context={context} root={root}>{children.length ? children : null}</ChartComponent>
  );
}

export default synthesize;
