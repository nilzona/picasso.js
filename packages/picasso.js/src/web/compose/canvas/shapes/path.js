/* eslint class-methods-use-this: "off" */

import CanvasShape from './canvas-shape';

class Path extends CanvasShape {
  renderShape({
    ctx, d, fill, stroke
  }) {
    if (ctx.g) {
      const g = ctx.g;
      const p = new Path2D(d);
      if (fill) {
        g.fill(p);
      }
      if (stroke) {
        g.stroke(p);
      }
    }
  }
}

export default Path;
