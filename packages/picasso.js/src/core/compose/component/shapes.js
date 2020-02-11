function shapeFunctions(instance, settings) {
  const appendComponentMeta = node => {
    node.key = settings.key;
    node.element = instance.renderer.element();
  };

  instance.shapesAt = (shape, opts = {}) => {
    const items = []; // rend.itemsAt(shape);
    let shapes;

    if (opts && opts.propagation === 'stop' && items.length > 0) {
      shapes = [items.pop().node];
    } else {
      shapes = items.map(i => i.node);
    }

    for (let i = 0, num = shapes.length; i < num; i++) {
      appendComponentMeta(shapes[i]);
    }

    return shapes;
  };
}

export default shapeFunctions;
