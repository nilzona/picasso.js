import { h } from 'preact';
import { extendAndTransformAttributes } from '../scene-graph/attributes';

export default function nodesToJSX(nodes) {
  const vNodes = [];
  nodes.forEach((node) => {
    let vNode;
    const { type, ...attrs } = node;
    const props = extendAndTransformAttributes(attrs);
    switch (type) {
      case 'rect':
        vNode = <rect {...props} />;
        break;
      case 'line':
        vNode = <line {...props} />;
        break;
      case 'circle':
        vNode = <circle {...props} />;
        break;
      case 'path':
        vNode = <path {...props} />;
        break;
      case 'text':
        vNode = <text {...props} />;
        break;
      default:
        // assume pure jsx node
        vNode = node;
        break;
    }
    vNodes.push(vNode);
  });
  return vNodes;
}
