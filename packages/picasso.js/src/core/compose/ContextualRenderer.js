import { h } from 'preact';
import nodesToJSX from './nodesToJSX';


function ContextualRenderer({ ctx, rect, nodes }) {
  const { renderContext } = ctx;
  const vNodes = nodesToJSX(nodes, ctx);
  if (!vNodes || vNodes.length === 0) {
    return undefined;
  }
  const width = Math.round(rect.width * rect.scaleRatio.x);
  const height = Math.round(rect.height * rect.scaleRatio.y);
  const style = {
    position: 'absolute',
    left: `${Math.round(rect.margin.left + (rect.x * rect.scaleRatio.x))}px`,
    top: `${Math.round(rect.margin.left + (rect.y * rect.scaleRatio.y))}px`,
    '--webkit-font-smoothing': 'antialiased',
    '-moz-osx-font-smoothing': 'antialiased'
  };

  if (renderContext === 'canvas') {
    return (
      <canvas ref={canvas => ctx.canvasElement = canvas} width={width} height={height}>{vNodes}</canvas>
    );
  }
  if (renderContext === 'svg') {
    ctx.ns = ctx.ns || 'http://www.w3.org/2000/svg';
    return (
      <svg xmlns={ctx.ns} style={style} width={width} height={height}>
        <g style='pointer-events: auto'>
          {vNodes}
        </g>
      </svg>
    );
  }
  // assume dom renderer
  style.width = `${width}px`;
  style.height = `${height}px`;
  return <div style={style}>{vNodes}</div>;
}

export default ContextualRenderer;
