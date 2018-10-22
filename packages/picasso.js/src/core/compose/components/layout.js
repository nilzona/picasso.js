const layoutComponent = {
  defaultSettings: {},

  componentWillMount() {
    console.log('componentWillMount');
  },

  componentDidMount() {
    console.log('componentDidMount');
  },

  componentWillReceiveProps() {
    console.log('componentWillReceiveProps');
  },

  shouldComponentUpdate() {
    console.log('shouldComponentUpdate');
  },

  componentWillUpdate() {
    console.log('componentWillUpdate');
  },

  componentDidUpdate() {
    console.log('componentDidUpdate');
  },

  componentWillUnmount() {
    console.log('componentWillUnmount');
  },

  layoutComponents(ctx) {
    console.log("let's layout");
    const settings = this.userSettings;
    const layoutStrategy = ctx.registries.layout(settings.strategy.type)(
      ctx,
      settings
    );
    layoutStrategy.layout(this.rect, this.getChildren());
  }
};

export default function layout(picasso) {
  picasso.component('layout', layoutComponent);
}
