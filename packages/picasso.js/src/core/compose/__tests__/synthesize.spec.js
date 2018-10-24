import synthesize from '../synthesize';

describe('synthesize', () => {
  it('should build up preact components from definition', () => {
    let settings = {
      components: [{
        type: 'test',
        settings: {
          components: [
            {
              type: 'test'
            },
            {
              type: 'test'
            }
          ]
        }
      }]
    };
    let context = {
      registries: {
        component: () => ({}),
        data: () => () => ({})
      }
    };
    const { vdom } = synthesize({ settings }, context);
    console.log(vdom)
    expect(vdom.children.length).to.equal(1);
    expect(vdom.children[0].children.length).to.equal(2);
  });
});
