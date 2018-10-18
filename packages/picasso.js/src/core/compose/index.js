import { render } from 'preact';
import extend from 'extend';
import synthesize from './synthesize';

function update(/* {  data, settings} */) {}

function compose(composeDefinition, context) {
  const { element, data, settings } = composeDefinition;
  const rootInstance = extend(
    {
      element,
      data,
      update,
      strategy: {
        type: 'dock'
      }
    },
    settings
  );

  const { instance, vdom } = synthesize(rootInstance, context);

  instance.layoutComponents();

  render(vdom, element);
  return rootInstance;
}

export default compose;
