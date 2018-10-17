import { h, Component } from 'preact';
import {
  Circle, Line, Path, Rect, Text
} from './shapes';

class Canvas extends Component {
  constructor() {
    super();
    this.attachCanvasContext = this.attachCanvasContext.bind(this);
    this.renderShapes = this.renderShapes.bind(this);
  }

  attachCanvasContext(canvas) {
    const { ctx } = this.props;
    ctx.canvas = canvas;
    ctx.g = canvas.getContext('2d');
  }

  renderShapes() {
    const { nodes, ctx } = this.props;
    const shapes = [];
    nodes.forEach((node) => {
      let vNode;
      const { type, ...props } = node;
      switch (type) {
        case 'circle':
          vNode = <Circle ctx={ctx} {...props} />;
          break;
        case 'line':
          vNode = <Line ctx={ctx} {...props} />;
          break;
        case 'path':
          vNode = <Path ctx={ctx} {...props} />;
          break;
        case 'rect':
          vNode = <Rect ctx={ctx} {...props} />;
          break;
        case 'text':
          vNode = <Text ctx={ctx} {...props} />;
          break;
        default:
          throw new Error('unknown shape type');
      }
      shapes.push(vNode);
    });
    return shapes;
  }

  render() {
    const { width, height, style } = this.props;

    return (
      <canvas
        ref={this.attachCanvasContext}
        width={width}
        height={height}
        style={style}
      >
        {this.renderShapes()}
      </canvas>
    );
  }
}

export default Canvas;
