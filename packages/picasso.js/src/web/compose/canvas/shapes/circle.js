/* eslint class-methods-use-this: "off" */

import CanvasShape from './canvas-shape';

class Circle extends CanvasShape {
  renderShape({
    ctx, cx = 0, cy = 0, r = 0, fill, stroke
  }) {
    if (ctx.g) {
      const g = ctx.g;
      g.moveTo(cx + r, cy);
      g.arc(cx, cy, r, 0, Math.PI * 2, false);
      if (fill) {
        g.fill();
      }
      if (stroke) {
        g.stroke();
      }
    }
  }
}

export default Circle;
