import { h } from 'preact';
import ChartComponent from './chart-component';
import create from './instance';

const synthesize = (userDef, context, depth = 0) => {
  let children = [];
  const instance = create(userDef, context, depth);
  const subComponents = userDef.settings
    ? userDef.settings.components || []
    : [];

  const subSynthesize = (subComponentUserDef) => {
    const oneLevelDeeper = synthesize(subComponentUserDef, context, ++depth);
    instance.addChild(oneLevelDeeper.instance);
    children.push(oneLevelDeeper.vdom);
  };

  subComponents.forEach(subSynthesize);

  return {
    vdom: (
      <ChartComponent instance={instance} context={context}>
        {children}
      </ChartComponent>
    ),
    instance
  };
};

export default synthesize;
