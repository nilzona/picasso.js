import { h } from 'preact';
import ChartComponent from './chart-component';
import create from './instance';

function getSubComponentUserDefs(userDef) {
  return userDef.settings ? userDef.settings.components || [] : [];
}

function synthesize(userDef, context, toolbox) {
  let children = [];
  const instance = create(userDef, context, toolbox);

  const subComponentUserDefs = getSubComponentUserDefs(userDef);

  const synrec = (subComponentUserDef) => {
    const oneLevelDeeper = synthesize(subComponentUserDef, context, toolbox);
    instance.addChild(oneLevelDeeper);
    children.push(oneLevelDeeper.vdom);
  };

  subComponentUserDefs.forEach(synrec);

  const vdom = <ChartComponent instance={instance}>{children}</ChartComponent>;
  instance.vdom = vdom;
  return instance;
}

function findComponent(components, key) {
  for (let i = 0; i < components.length; ++i) {
    if (components[i].key === key) {
      return components[i];
    }
  }
  return undefined;
}

function syntheticupdate(component, userDef, context, toolbox) {
  component.update(userDef);
  const children = component.getChildren();

  // shallow copy children and leave it empty to refill it later
  const components = children.splice(0, children.length);

  const syntheticUpdateRecursive = (sc) => {
    let c;
    if (sc.key) {
      c = findComponent(components, sc.key);
      if (c) {
        syntheticupdate(c, sc, context, toolbox);
      } else {
        c = synthesize(sc, context, toolbox);
      }
    } else {
      c = synthesize(sc, context, toolbox);
    }
    children.push(c);
  };

  getSubComponentUserDefs(userDef).forEach(syntheticUpdateRecursive);
}

function syntheticDataUpdate(component) {
  component.update();
  const syntheticDataUpdateRecursive = (sc) => {
    syntheticDataUpdate(sc);
  };
  component.getChildren().forEach(syntheticDataUpdateRecursive);
}

export { synthesize, syntheticupdate, syntheticDataUpdate };
