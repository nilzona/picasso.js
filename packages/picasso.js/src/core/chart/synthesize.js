// import { h  } from 'preact';

function synthesize(definition) {
  const tree = {};
  definition.settings.components.forEach((c) => {
    tree.x = c.type;
    // console.log(c.type);
  });
  return tree;
}

export default synthesize;
