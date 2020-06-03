import 'jest';

import { AsyncCombiner } from '../src/async-combiner';

class Mock1 extends AsyncCombiner {
  count: number = 0;
  constructor() {
    super();
    this._func = this._func.bind(this);
  }

  func1(url: string) {
    return this.$asyncCombine(url, () => this._func(url));
  }
  func2(url: string, clone?: boolean) {
    return this.$asyncCombine(arguments, () => this._func(url), clone);
  }
  _func(url: string): Promise<{ url: string }> {
    this.count++;
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ url });
      }, 250);
    });
  }
}

describe('module:async-combiner', () => {
  describe('class AsyncCombiner', () => {
    it('should can construct', () => {
      class Hoge extends AsyncCombiner {}
      const hoge = new Hoge();
      expect(hoge.$asyncCombine).toBeInstanceOf(Function);
      expect(hoge.$asyncCombinerContext.combine).toBeInstanceOf(Function);
    });
  });
  describe('$asyncCombine()', () => {
    it('should can combine', () => {
      return new Promise(async (resolve) => {
        const mock = new Mock1();
        const promises = [
          mock.func1('/hoge'),
          mock.func1('/hoge'),
          mock.func1('/hoge'),
          mock.func1('/hoge'),
        ];
        expect(mock.$asyncCombinerContext._runnings.length).toStrictEqual(1);
        expect(
          mock.$asyncCombinerContext._runnings[0].resolvers.length,
        ).toStrictEqual(4);
        const [a1, a2, a3, a4] = await Promise.all(promises);
        expect(a1).toStrictEqual({ url: '/hoge' });
        expect(a2).toStrictEqual({ url: '/hoge' });
        expect(a3).toStrictEqual({ url: '/hoge' });
        expect(a4).toStrictEqual({ url: '/hoge' });
        expect(a1 === a2).toStrictEqual(false);
        expect(mock.count).toStrictEqual(1);
        expect(mock.$asyncCombinerContext._runnings.length).toStrictEqual(0);
        resolve();
      });
    });
    it('should detect condition', () => {
      return new Promise(async (resolve) => {
        const mock = new Mock1();
        const promises = [
          mock.func2('/hoge'),
          mock.func2('/hoge', false),
          mock.func2('/hoge', true),
          mock.func2('/hoge', false),
        ];
        expect(mock.$asyncCombinerContext._runnings.length).toStrictEqual(3);
        const [r1, r2, r3] = mock.$asyncCombinerContext._runnings;
        expect(r1.condition).toStrictEqual({ '0': '/hoge' });
        expect(r1.resolvers.length).toStrictEqual(1);
        expect(r2.condition).toStrictEqual({ '0': '/hoge', '1': false });
        expect(r2.resolvers.length).toStrictEqual(2);
        expect(r3.condition).toStrictEqual({ '0': '/hoge', '1': true });
        expect(r3.resolvers.length).toStrictEqual(1);
        const [a1, a2, a3, a4] = await Promise.all(promises);
        expect(a1).toStrictEqual({ url: '/hoge' });
        expect(a2).toStrictEqual({ url: '/hoge' });
        expect(a3).toStrictEqual({ url: '/hoge' });
        expect(a4).toStrictEqual({ url: '/hoge' });
        expect(a1 === a2).toStrictEqual(false);
        expect(a2 === a4).toStrictEqual(true);
        expect(mock.count).toStrictEqual(3);
        expect(mock.$asyncCombinerContext._runnings.length).toStrictEqual(0);
        resolve();
      });
    });
  });
});
