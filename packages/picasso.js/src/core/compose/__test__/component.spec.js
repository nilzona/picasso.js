import { render, cleanup } from 'preact-testing-library';
import PicassoComponent from '../../../../'

describe('Picasso Preact Component', () => {
  afterEach(cleanup);

  it('should call lifecycle methods', () => {
    render(<div />);
  });
});
