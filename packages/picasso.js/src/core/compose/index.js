import { render } from 'preact';
import synthesize from './synthesize';

// function update(/* {  data, settings} */) {}

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
  const userDef = { data, settings };

  const { instance, vdom } = synthesize(userDef, context);
  const { width, height } = getDim(element);
  instance.rect = {
    x: 0,
    y: 0,
    width,
    height
  };
  instance.layoutComponents(userDef.strategy);

  render(vdom, element);
  return instance;
}

export default compose;
