export default settings => ({
  preferredSize() {
    return 300;
  },
  preferredDimension() {
    let dim = { w: 0, h: 0 };
    this.getChildren().forEach((child) => {
      const { w, h } = child.preferredDimension() || { w: 0, h: 0 };
      dim.w += w;
      dim.h += h;
    });
    return dim;
  },
  layoutComponent() {
    const dim = this.preferredDimension();
    console.info(settings, dim);
  }
});
