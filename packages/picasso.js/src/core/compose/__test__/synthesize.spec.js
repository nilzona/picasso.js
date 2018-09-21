import elementMock from 'test-utils/mocks/element-mock';
import synthesize from '../../../../src/core/compose/synthesize';

describe('synthesize', () => {
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

  it('should build up preact components from definition', () => {
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
    const instance = {};
    const vnode = synthesize(definition.settings, context, instance);
    expect(vnode.children.length).to.equal(1);
    expect(vnode.children[0].children.length).to.equal(2);
  });
});
