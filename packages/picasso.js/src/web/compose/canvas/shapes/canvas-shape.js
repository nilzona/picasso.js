/* eslint class-methods-use-this: "off" */

import { Component } from 'preact';

class CanvasShape extends Component {
  constructor({ ctx }) {
    super();
    this.state = { canvasReady: false };
    this.ctx = ctx;
  }

  setCanvasReadyState() {
    if (this.ctx.g && !this.state.canvasReady) {
      this.setState({ canvasReady: true });
    } else if (!this.ctx.g && this.state.canvasReady) {
      this.setState({ canvasReady: false });
    }
  }

  componentDidMount() {
    this.setCanvasReadyState();
  }

  componentWillUpdate() {
    this.setCanvasReadyState();
  }

  render(props, { canvasReady }) {
    if (canvasReady) {
      const g = props.ctx.g;
      g.save();

      if (props.fill) {
        g.fillStyle = props.fill;
      }

      if (props.stroke) {
        g.strokeStyle = props.stroke;
      }

      this.renderShape(props);

      g.restore();
    }
  }

  renderShape() {
    throw new Error('renderShape method is not implemented in sub class');
  }
}

export default CanvasShape;
