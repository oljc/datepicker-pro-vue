import { getPrefixCls } from '../src/utils/config';

describe('getPrefixCls', () => {
  it('返回带前缀名', () => {
    expect(getPrefixCls('button')).toBe('ljc-button');
  });

  it('不传参', () => {
    expect(getPrefixCls()).toBe('ljc');
  });
});
