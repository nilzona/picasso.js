import { Component } from 'preact';

function callLifeCycleMethod(method, definition, instance, ...args) {
  if (definition[method]) {
    definition[method].call(instance, ...args);
  }
}

class PicassoComponent extends Component {
  constructor({ definition, context, instance }) {
    super();
    this.definition = definition;
    this.context = context;
    this.instance = instance;
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

function createComponent(definition, context) {
  
}

export default PicassoComponent;
