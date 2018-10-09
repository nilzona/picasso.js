import { h, Component } from 'preact';
// import mapDeprecated from './mapDeprecated';

class ChartComponent extends Component {
  constructor({ wrappedInstance, renderer }) {
    super();
    this.wrappedInstance = wrappedInstance;
    this.renderer = renderer;
    this.wrappedInstance.resize();
  }

  render(props) { // props, state
    if (this.wrappedInstance.render) {
      const nodes = this.wrappedInstance.render();
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
