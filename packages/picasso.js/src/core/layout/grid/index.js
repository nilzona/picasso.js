const gridStrategy = {
  layout(instance) {
    const dim = instance.preferredDimension();
    console.info(dim);
  }
};

export default gridStrategy;
