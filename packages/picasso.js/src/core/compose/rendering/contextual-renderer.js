import { h } from 'preact';
import Canvas from '../../../web/compose/canvas';
import { extendAndTransformAttributes } from '../../scene-graph/attributes';
import { maybeAddGradients } from './svg-gradient';

function ContextualRenderer({ ctx, rect, nodes }) {
  const { renderContext } = ctx;
  if (!nodes || nodes.length === 0) {
    return undefined;
  }
  const width = Math.round(rect.width * rect.scaleRatio.x);
  const height = Math.round(rect.height * rect.scaleRatio.y);
  const style = {
    position: 'absolute',
    left: `${Math.round(rect.margin.left + rect.x * rect.scaleRatio.x)}px`,
    top: `${Math.round(rect.margin.left + rect.y * rect.scaleRatio.y)}px`,
    '--webkit-font-smoothing': 'antialiased',
    '-moz-osx-font-smoothing': 'antialiased'
  };

  if (renderContext === 'canvas') {
    return (
      <Canvas
        ctx={ctx}
        nodes={nodes}
        width={width}
        height={height}
        style={style}
      />
    );
  }
  const vNodes = [];
  const vDefs = [];
  nodes.forEach((node) => {
    let vNode;
    const { type, ...attrs } = node;
    const props = extendAndTransformAttributes(attrs);
    maybeAddGradients(props, vDefs);
    const DomNode = type;
    vNode = <DomNode {...props} />;
    vNodes.push(vNode);
  });
  if (renderContext === 'svg') {
    ctx.ns = ctx.ns || 'http://www.w3.org/2000/svg';
    return (
      <svg xmlns={ctx.ns} style={style} width={width} height={height}>
        <defs>{vDefs}</defs>
        <g style="pointer-events: auto">{vNodes}</g>
      </svg>
    );
  }
  // assume dom renderer
  style.width = `${width}px`;
  style.height = `${height}px`;
  return <div style={style}>{vNodes}</div>;
}

export default ContextualRenderer;
