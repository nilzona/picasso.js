import preact from 'preact';
import jsonRender from 'preact-render-to-json';
import elementMock from 'test-utils/mocks/element-mock';
import compose from '..';

describe('picasso.compose function', () => {
  let preactRender = preact.render;
  let componentWillMount;
  let componentDidMount;
  let componentWillUnmount;
  let componentWillReceiveProps;
  let shouldComponentUpdate;
  let componentWillUpdate;
  let componentDidUpdate;

  let definition;
  let element;

  beforeEach(() => {
    preact.render = jsonRender;
    element = elementMock();
    componentWillMount = sinon.spy();
    componentDidMount = sinon.spy();
    componentWillUnmount = sinon.spy();
    componentWillReceiveProps = sinon.spy();
    shouldComponentUpdate = sinon.spy();
    componentWillUpdate = sinon.spy();
    componentDidUpdate = sinon.spy();

    definition = {
      element,
      settings: {
        scales: {},
        components: [],
        data: {}
      },
      context: {
        registries: {
          component: () => {},
          data: () => () => ({})
        }
      },
      componentWillMount,
      componentDidMount,
      componentWillUnmount,
      componentWillReceiveProps,
      shouldComponentUpdate,
      componentWillUpdate,
      componentDidUpdate
    };
  });

  afterEach(() => {
    preact.render = preactRender;
  });

  it('call lifeCycle function', () => {
    definition.settings.components = [
      {
        type: 'test',
        components: [
          {
            type: 'test'
          },
          {
            type: 'test'
          }
        ]
      }
    ];
    compose(definition, { registries: { component: sinon.spy() } });
    // expect something
  });
});


// expect(tree).toMatchSnapshot();
