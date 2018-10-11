import { h } from 'preact';
import ChartComponent from './ChartComponent';
import create from './instance';

function synthesize(userDef, context) {
  userDef.components = userDef.components || [];
  let children = [];
  const instance = create(userDef, context);

  userDef.components.forEach((subComponentUserDef) => {
    const oneLevelDeeper = synthesize(subComponentUserDef, context, instance);
    instance.addChild(oneLevelDeeper.instance);
    children.push(oneLevelDeeper.vdom);
  });
  return {
    vdom: <ChartComponent instance={instance} context={context}>{children}</ChartComponent>,
    instance
  };
}

export default synthesize;
