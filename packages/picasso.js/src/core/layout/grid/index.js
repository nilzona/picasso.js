export default settings => ({
  preferredDimension(instance) {
    let dim = { w: 0, h: 0 };
    instance.getChildren().forEach((child) => {
      const { w, h } = child.preferredDimension() || { w: 0, h: 0 };
      dim.w += w;
      dim.h += h;
    });
    return dim;
  },
  layout(instance) {
    const dim = this.preferredDimension(instance);
    console.info(settings, dim);
  }
});
