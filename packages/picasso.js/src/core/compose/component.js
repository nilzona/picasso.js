import { h, Component } from 'preact';
import extend from 'extend';

function componentInstance(definition, chart) {
  const { context } = definition;
  const { registries } = context;

  const compInstance = extend({}, definition);
  compInstance.chart = chart;

  // callback methods
  compInstance.callComponentMethod = (method, instanceDefinition, componentDefinition, instance, ...args) => {
    if (instanceDefinition && instanceDefinition[method]) {
      instanceDefinition[method].call(instance, ...args);
    }
  };

  return compInstance;
}

class ChartComponent extends Component {
  constructor({ instanceDefinition, root }) {
    super();
    this.definition = instanceDefinition;
    this.instance = componentInstance(instanceDefinition, root);
    this.root = root;
  }

  componentWillMount() {
    this.instance.callComponentMethod('componentWillMount', this.definition, this.instance);
  }

  componentDidMount() {
    this.instance.callComponentMethod('componentDidMount', this.definition, this.instance);
  }

  shouldComponentUpdate(...args) {
    this.instance.callComponentMethod('shouldComponentUpdate', this.definition, this.instance, ...args);
  }

  componentWillReceiveProps(...args) {
    this.instance.callComponentMethod('componentWillReceiveProps', this.definition, this.instance, ...args);
  }

  componentWillUpdate(...args) {
    this.instance.callComponentMethod('componentWillUpdate', this.definition, this.instance, ...args);
  }

  componentDidUpdate(...args) {
    this.instance.callComponentMethod('componentDidUpdate', this.definition, this.instance, ...args);
  }

  componentWillUnmount() {
    this.instance.callComponentMethod('componentWillUnmount', this.definition, this.instance);
  }

  render() { // props, state
    if (!this.definition) {
      return <div>No definition</div>;
    }
    return <div>This is a chart component</div>;
  }
}

export default ChartComponent;
