export default settings => ({
  layout(instance) {
    const dim = instance.preferredDimension();
    console.info(settings, dim);
  }
});
