import create from '../instance';

describe('instance', () => {
  let sandbox;
  let component;
  let data;
  let instance;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    component = sandbox.stub().returns({});
    data = sandbox.stub();
    instance = create({}, { registries: { component, data } });
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should create default instance', () => {
    // make a snapshot of default, update as we continue to add functionality
    expect(instance).toMatchSnapshot();
  });

  it('should add child', () => {
    const child = {};
    instance.addChild(child);
    expect(instance.getChildren().pop()).to.equal(child);
  });

  it('should get children', () => {
    const c1 = {};
    const c2 = {};
    const c3 = {};
    [c1, c2, c3].map(c => instance.addChild(c));
    expect(instance.getChildren()).to.have.length(3);
  });

});
