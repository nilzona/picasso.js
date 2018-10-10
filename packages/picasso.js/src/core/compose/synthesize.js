import { h } from 'preact';
import ChartComponent from './ChartComponent';
import wrap from './wrap';

function synthesize(userDef, context) {
  userDef.components = userDef.components || [];
  let children = [];
  const instance = wrap(userDef, context);

  userDef.components.forEach((subComponentUserDef) => {
    const oneLevelDeeper = synthesize(subComponentUserDef, context, instance);
    instance.__addChild(oneLevelDeeper.instance);
    children.push(oneLevelDeeper.vdom);
  });
  return {
    vdom: <ChartComponent instance={instance} context={context}>{children}</ChartComponent>,
    instance
  };
}

export default synthesize;
