const layoutComponent = {
  defaultSettings: {
    settings: {
      strategy: {
        type: 'dock'
      },
      components: []
    }
  },
  require: ['registries'],

  created() {
    const strategy = this.userSettings.settings.strategy;
    this.layoutStrategy = this.registries.layout(strategy.type)(strategy);
  },

  getPreferredSize() {
    const components = this.getChildren().filter(c => c.userSettings.show);
    return this.layoutStrategy.getPreferredSize(components);
  },

  layoutComponents() {
    const components = this.getChildren().filter(c => c.userSettings.show);
    this.layoutStrategy.layout(this.rect, components);
  }
};

export default function layout(picasso) {
  picasso.component('layout', layoutComponent);
}
