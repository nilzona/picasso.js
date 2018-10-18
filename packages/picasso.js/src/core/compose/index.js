import { render } from 'preact';
import extend from 'extend';
import synthesize from './synthesize';

function update(/* {  data, settings} */) {}

const getDim = (element) => {
  if (typeof element.getBoundingClientRect === 'function') {
    const { width, height } = element.getBoundingClientRect();
    return {
      width,
      height
    };
  }
  return {
    width: 0,
    height: 0
  };
};

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
  const { width, height } = getDim(element);
  instance.rect = {
    x: 0,
    y: 0,
    width,
    height
  };
  instance.layoutComponents();

  render(vdom, element);
  return rootInstance;
}

export default compose;
