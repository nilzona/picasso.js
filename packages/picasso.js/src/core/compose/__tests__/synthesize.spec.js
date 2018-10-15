import synthesize from '../synthesize';

describe('synthesize', () => {
  it('should build up preact components from definition', () => {
    let settings = {
      components: [{
        type: 'test',
        components: [
          {
            type: 'test'
          },
          {
            type: 'test'
          }
        ]
      }]
    };
    let context = {
      registries: {
        component: () => {},
        data: () => () => ({})
      }
    };
    const instance = {};
    const { vdom } = synthesize(settings, context, instance);
    expect(vdom.children.length).to.equal(1);
    expect(vdom.children[0].children.length).to.equal(2);
  });
});
