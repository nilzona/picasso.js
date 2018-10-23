import { h, Component } from 'preact';
import ContextualRenderer from './rendering/contextual-renderer';
// import createRendererBox from './rendering/renderer-box';
// import mapDeprecated from './mapDeprecated';

class ChartComponent extends Component {
  constructor({ instance }) {
    super();
    this.instance = instance;
    this.instance.created();
  }

  render({ context, children }) {
    // props, state
    if (!this.instance.visible) {
      return undefined;
    }
    if (children && children[0]) {
      return <div>{children}</div>;
    }
    let nodes;
    if (this.instance.render) {
      nodes = this.instance.render();
      const ctx = {
        renderContext:
          context.renderer && context.renderer.prio
            ? context.renderer.prio[0] || 'svg'
            : 'svg'
      };
      return (
        <ContextualRenderer ctx={ctx} rect={this.instance.rect} nodes={nodes} />
      );
    }
    return undefined;
  }

  componentWillMount(...args) {
    this.instance.componentWillMount(...args);
  }

  componentDidMount(...args) {
    this.instance.componentDidMount(...args);
  }

  componentWillReceiveProps(...args) {
    this.instance.componentWillReceiveProps(...args);
  }

  shouldComponentUpdate(...args) {
    this.instance.shouldComponentUpdate(...args);
  }

  componentWillUpdate(...args) {
    this.instance.componentWillUpdate(...args);
  }

  componentDidUpdate(...args) {
    this.instance.componentDidUpdate(...args);
  }

  componentWillUnmount(...args) {
    this.instance.componentWillUnmount(...args);
  }
}

export default ChartComponent;
