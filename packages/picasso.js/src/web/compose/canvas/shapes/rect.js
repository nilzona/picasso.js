import CanvasShape from './canvas-shape';

class Rect extends CanvasShape {
  renderShape({
    ctx, x, y, width, height, fill, stroke
  }) {
    if (ctx.g) {
      const g = this.ctx.g;
      g.beginPath();
      g.rect(x, y, width, height);
      if (fill) {
        g.fill();
      }
      if (stroke) {
        g.stroke();
      }
    }
  }
}

export default Rect;
