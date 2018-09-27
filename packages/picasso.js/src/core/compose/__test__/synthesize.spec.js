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
    const vnode = synthesize(settings, context, instance);
    expect(vnode.children.length).to.equal(1);
    expect(vnode.children[0].children.length).to.equal(2);
  });
});
