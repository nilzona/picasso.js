import { Component } from 'preact';
import extend from 'extend';

function callLifeCycleMethod(method, definition, instance, ...args) {
  if (definition[method]) {
    definition[method].call(instance, ...args);
  }
}

function componentInstance(definition, context, chart) {
  const compInstance = extend({ chart }, definition);
  return compInstance;
}

class ChartComponent extends Component {
  constructor({ definition, context, chart }) {
    super();
    this.definition = definition;
    this.context = context;
    this.instance = componentInstance(definition, context, chart);
    this.chartInstance = chart;
  }

  componentWillMount() {
    callLifeCycleMethod('componentWillMount', this.definition, this.instance);
  }

  componentDidMount() {
    callLifeCycleMethod('componentDidMount', this.definition, this.instance);
  }

  shouldComponentUpdate(...args) {
    callLifeCycleMethod('shouldComponentUpdate', this.definition, this.instance, ...args);
  }

  componentWillReceiveProps(...args) {
    callLifeCycleMethod('componentWillReceiveProps', this.definition, this.instance, ...args);
  }

  componentWillUpdate(...args) {
    callLifeCycleMethod('componentWillUpdate', this.definition, this.instance, ...args);
  }

  componentDidUpdate(...args) {
    callLifeCycleMethod('componentDidUpdate', this.definition, this.instance, ...args);
  }

  componentWillUnmount() {
    callLifeCycleMethod('componentWillUnmount', this.definition, this.instance);
  }
}

export default ChartComponent;
