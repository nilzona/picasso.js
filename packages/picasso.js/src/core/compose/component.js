import { h, Component } from 'preact';
import extend from 'extend';
// import mapDeprecated from './mapDeprecated';

class ChartComponent extends Component {
  constructor({ definition, context, root }) {
    super();

    const { registries, ctxRenderer } = context;
    const definitionInstance = extend({}, definition);
    const componentInstance = extend({}, registries.component(definition.type));

    // mapDeprecated(componentInstance);

    const renderer = ctxRenderer || registries.renderer(definitionInstance.renderer || componentInstance.renderer)();

    // set this-props
    this.root = root;
    this.renderer = renderer;
    this.componentInstance = componentInstance;
    this.definitionInstance = definitionInstance;

    this.resize();

    [
      'componentWillMount',
      'componentDidMount',
      'shouldComponentUpdate',
      'componentWillReceiveProps',
      'componentWillUpdate',
      'componentDidUpdate',
      'componentWillUnmount',
      'beforeRender'
    ].forEach((method) => {
      this[method] = (...args) => {
        if (this.componentInstance[method]) {
          this.componentInstance[method](...args);
        }
        if (this.definitionInstance[method]) {
          this.definitionInstance[method](...args);
        }
      };
    });
  }

  resize() {
    const rect = {
      x: 0,
      y: 0,
      width: 50,
      height: 50,
      margin: { left: 0 },
      scaleRatio: { x: 1, y: 1 }
    };
    this.componentInstance.rect = rect;
    this.definitionInstance.rect = rect;
  }

  render(props) { // props, state
    if (this.componentInstance.render) {
      const nodes = this.componentInstance.render();
      this.renderer.render(nodes);
      // this.currentNodes = nodes;
    }
    return (
    <div>
      {props.children}
    </div>
    );
  }
}

export default ChartComponent;

/*

componentWillMount() {
    this.callComponentMethod('componentWillMount');
  }

  componentDidMount() {
    this.callComponentMethod('componentDidMount');
  }

  shouldComponentUpdate(...args) {
    this.callComponentMethod('shouldComponentUpdate', ...args);
  }

  componentWillReceiveProps(...args) {
    this.callComponentMethod('componentWillReceiveProps', ...args);
  }

  componentWillUpdate(...args) {
    this.callComponentMethod('componentWillUpdate', ...args);
  }

  componentDidUpdate(...args) {
    this.instance.callComponentMethod('componentDidUpdate', ...args);
  }

  componentWillUnmount() {
    this.instance.callComponentMethod('componentWillUnmount');
  }

*/
