import { h, Component } from 'preact';

class Rect extends Component {
  constructor({ ctx }) {
    super();
    this.ctx = ctx;
  }

  componentDidMount() {
    if (this.ctx.canvas) {
      console.log('got canvas');
    }
  }

  // renderToCanvas() {
  //   const {
  //     ctx,
  //     x,
  //     y,
  //     width,
  //     height,
  //     fill
  //   } = this.props;
  //   const g = ctx.canvas.g;
  //   g.beginPath();
  //   g.rect(x, y, width, height);
  //   if (doFill) {
  //     g.fill();
  //   }
  //   if (doStroke) {
  //     g.stroke();
  //   }
  // }

  render({
    fill,
    x,
    y,
    width,
    height
  }) {
    if (this.ctx.renderContext === 'svg') {
      return <rect x={x} y={y} width={width} height={height} fill={fill} />;
    }
    // do nothing yet
    return undefined;
  }
}

export default Rect;
