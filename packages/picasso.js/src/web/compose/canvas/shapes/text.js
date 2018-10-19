/* eslint class-methods-use-this: "off" */

import { ellipsText, measureText } from '../../../text-manipulation';
import baselineHeuristic from '../../../text-manipulation/baseline-heuristic';
import {
  detectTextDirection,
  flipTextAnchor
} from '../../../../core/utils/rtl-util';

import CanvasShape from './canvas-shape';

class Text extends CanvasShape {
  renderShape({
    ctx, x = 0, dx = 0, y = 0, dy = 0, ...attrs
  }) {
    if (ctx.g) {
      const g = ctx.g;
      const t = {
        x, dx, y, dy, ...attrs
      };
      const text = ellipsText(t, measureText);

      g.font = `${t['font-size']} ${t['font-family']}`;
      g.canvas.dir = detectTextDirection(t.text);
      const textAlign = t['text-anchor'] === 'middle' ? 'center' : t['text-anchor'];
      g.textAlign = flipTextAnchor(textAlign, g.canvas.dir);

      const bdy = baselineHeuristic(t);

      g.fillText(text, t.x + t.dx, t.y + t.dy + bdy);
    }
  }
}

export default Text;
