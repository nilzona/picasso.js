import { h, Component } from 'preact';
import ContextualRenderer from './contextual-renderer';
import createRendererBox from '../../web/renderer/renderer-box';
// import mapDeprecated from './mapDeprecated';

class ChartComponent extends Component {
  constructor({ instance }) {
    super();
    this.instance = instance;
    this.resize();
  }

  resize(rect) {
    if (rect) {
      const newRect = createRendererBox(rect);
      if (JSON.stringify(rect) !== JSON.stringify(newRect)) {
        this.rect = newRect;
      }
    } else {
      this.rect = {
        x: 0,
        y: 0,
        width: 500,
        height: 500,
        margin: { left: 0 },
        scaleRatio: { x: 1, y: 1 }
      };
    }
    this.instance.rect = this.rect;
    return this.rect;
  }

  render({ context, children }) {
    // props, state
    if (children && children[0]) {
      return <div>{children}</div>;
    }
    let nodes;
    if (this.instance.render) {
      nodes = this.instance.render();
      const ctx = { renderContext: context.ctxRenderer || 'canvas' };
      return <ContextualRenderer ctx={ctx} rect={this.rect} nodes={nodes} />;
    }
    return undefined;
  }

  componentWillMount() {
    this.instance.componentWillMount();
  }

  componentDidMount() {
    this.instance.componentDidMount();
  }

  componentWillUpdate() {
    this.instance.componentWillUpdate();
  }

  componentDidUpdate() {
    this.instance.componentDidUpdate();
  }
}

export default ChartComponent;
