import { synthesize } from '../synthesize';

describe('synthesize', () => {
  it('should build up preact components from definition', () => {
    let settings = {
      components: [
        {
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
        }
      ]
    };
    let context = {
      registries: {
        component: () => ({}),
        data: () => () => ({})
      }
    };
    let toolbox = {
      theme: {
        style: () => {}
      }
    };
    const instance = synthesize({ settings }, context, toolbox);
    expect(instance.vdom.children.length).to.equal(1);
    expect(instance.vdom.children[0].children.length).to.equal(2);
  });
});
