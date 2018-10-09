import { h } from 'preact';
import Rect from './shapes/Rect';

export default function nodesToJSX(nodes, ctx) {
  const vNodes = [];
  (nodes).forEach((node) => {
    switch (node.type) {
      case 'rect':
        vNodes.push(<Rect ctx={ctx} fill={node.fill} x={node.x} y={node.y} width={node.width} height={node.height} />);
        break;
      default:
        // assuming "pure" jsx elements
        vNodes.push(node);
        break;
    }
  });
  return vNodes;
}
