import {
  assignMappedAttribute,
  extendAndTransformAttributes
} from '../attributes';

describe('Attributes', () => {
  it('should assign mapped attributes', () => {
    const source = { custom: 2, strokeWidth: 3 };
    const target = {};
    assignMappedAttribute(target, source);

    expect(target).to.deep.equal({ 'stroke-width': 3 });
  });

  it('extend and transform attributes', () => {
    const source = { custom: 2, strokeWidth: 3 };
    const transformed = extendAndTransformAttributes(source);

    expect(transformed).to.deep.equal({ custom: 2, 'stroke-width': 3 });
  });
});
