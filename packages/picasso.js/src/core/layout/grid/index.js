export default (ctx, settings) => ({
  layout(rect, components) {
    // just a dummy layout engine
    console.log('layout grid');
    let rows = Math.ceil(Math.sqrt(components.length));
    let cols = rows;
    let dx = rect.width / cols;
    let dy = rect.height / cols;
    // special case
    if (components.length <= 2) {
      rows = 1;
      cols = components.length;
      dy = rect.height;
    }
    let handled = 0;
    let subRect = {
      x: rect.x,
      y: rect.y,
      width: dx,
      height: dy
    };
    // implement colspan
    for (let x = 0; x < rows; x++) {
      for (let y = 0; y < cols; y++) {
        if (handled >= components.length) {
          break;
        }
        components[handled++].rect = subRect;
        subRect.x += dx;
      }
      subRect.x = 0;
      subRect.y += dy;
    }
    components.forEach((c) => {
      c.layoutComponents(ctx);
    });
  }
});
