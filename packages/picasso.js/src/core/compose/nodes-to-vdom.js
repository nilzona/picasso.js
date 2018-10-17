import { h } from 'preact';

export default function nodesToJSX(nodes) {
  const vNodes = [];
  nodes.forEach((node) => {
    let vNode;
    const { type, ...props } = node;
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
