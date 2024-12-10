import { CleanProductCodePipe } from './clean-product-code.pipe';

describe('CleanProductCodePipe', () => {
  it('create an instance', () => {
    const pipe = new CleanProductCodePipe();
    expect(pipe).toBeTruthy();
  });
});
