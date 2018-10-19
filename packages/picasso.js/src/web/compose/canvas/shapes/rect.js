/* eslint class-methods-use-this: "off" */

import CanvasShape from './canvas-shape';

class Rect extends CanvasShape {
  renderShape({
    ctx, x = 0, y = 0, width = 0, height = 0, fill, stroke
  }) {
    if (ctx.g) {
      const g = ctx.g;
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
