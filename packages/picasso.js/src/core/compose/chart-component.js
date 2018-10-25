import { h, Component } from 'preact';
import ContextualRenderer from './rendering/contextual-renderer';

class ChartComponent extends Component {
  constructor({ instance }) {
    super();
    this.instance = instance;
  }

  render({ children, instance }) {
    // props, state
    if (!instance.visible) {
      return undefined;
    }
    if (children && children[0]) {
      return <div>{children}</div>;
    }
    let nodes;
    if (instance.render) {
      const ctx = this.instance.ctx;
      nodes = instance.render(ctx, h);
      return (
        <ContextualRenderer ctx={ctx} rect={instance.rect} nodes={nodes} />
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
