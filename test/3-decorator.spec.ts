import 'jest';

import { Combine } from '../src/decorator';

class Mock1 {
  count1: number = 0;
  count2: number = 0;
  count3: number = 0;
  count5: number = 0;
  count6: number = 0;
  count7: number = 0;
  count8: number = 0;

  @Combine()
  func1(url: string) {
    this.count1++;
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ url });
      }, 250);
    });
  }

  @Combine({
    clone: false,
  })
  func2(url: string) {
    this.count2++;
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ url });
      }, 250);
    });
  }

  @Combine()
  func3(url: string) {
    this.count3++;
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('fake error'));
      }, 250);
    });
  }

  @Combine()
  async func4(url: string) {
    throw new Error('fake error');
  }

  @Combine((url) => {
    return url;
  })
  func5(url: string, num: number) {
    this.count5++;
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        resolve({ url: url + num });
      }, 250);
    });
  }

  @Combine({
    createCondition: (url, num) => {
      return url + num;
    },
    clone: false,
  })
  func6(url: string, num: number) {
    this.count6++;
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        resolve({ url: url + num });
      }, 250);
    });
  }

  @Combine({
    delay: 2000,
  })
  func7(url: string) {
    this.count7++;
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ url });
      }, 250);
    });
  }

  @Combine({
    delay: 500,
  })
  func8(url: string) {
    this.count8++;
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ url });
      }, 250);
    });
  }
}

function wait(duration: number) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

describe('module:decorator', () => {
  describe('decorator Combine', () => {
    it('should can decorate', () => {
      const mock = new Mock1();
      expect(mock.func1).toBeInstanceOf(Function);
      expect(mock.func1.name).toStrictEqual('asyncCombine');
    });
    it('should can combine', () => {
      return new Promise(async (resolve) => {
        const mock = new Mock1();
        const promises = [
          mock.func1('/hoge'),
          mock.func1('/hoge'),
          mock.func1('/hoge'),
          mock.func1('/hoge'),
        ];
        const [a1, a2, a3, a4] = await Promise.all(promises);
        expect(a1).toStrictEqual({ url: '/hoge' });
        expect(a2).toStrictEqual({ url: '/hoge' });
        expect(a3).toStrictEqual({ url: '/hoge' });
        expect(a4).toStrictEqual({ url: '/hoge' });
        expect(a1 === a2).toStrictEqual(false);
        expect(mock.count1).toStrictEqual(1);
        resolve();
      });
    });
    it('should can disable clone', () => {
      return new Promise(async (resolve) => {
        const mock = new Mock1();
        const promises = [
          mock.func2('/hoge'),
          mock.func2('/hoge'),
          mock.func2('/hoge'),
          mock.func2('/hoge'),
        ];
        const [a1, a2, a3, a4] = await Promise.all(promises);
        expect(a1).toStrictEqual({ url: '/hoge' });
        expect(a2).toStrictEqual({ url: '/hoge' });
        expect(a3).toStrictEqual({ url: '/hoge' });
        expect(a4).toStrictEqual({ url: '/hoge' });
        expect(a1 === a2).toStrictEqual(true);
        expect(mock.count2).toStrictEqual(1);
        resolve();
      });
    });
    it('should can reject', () => {
      return new Promise(async (resolve, reject) => {
        const mock = new Mock1();
        const promises = [
          mock.func3('/hoge'),
          mock.func3('/hoge'),
          mock.func3('/hoge'),
          mock.func3('/hoge'),
        ];
        try {
          await Promise.all(promises);
          reject('成功しちゃダメだった');
        } catch (err) {
          expect(err).toBeInstanceOf(Error);
          expect(err.message).toStrictEqual('fake error');
          expect(mock.count3).toStrictEqual(1);
          resolve();
        }
      });
    });
    it('should can reject', () => {
      return new Promise(async (resolve, reject) => {
        const mock = new Mock1();
        const promises = [
          mock.func4('/hoge'),
          mock.func4('/hoge'),
          mock.func4('/hoge'),
          mock.func4('/hoge'),
        ];
        try {
          await Promise.all(promises);
          reject('成功しちゃダメだった');
        } catch (err) {
          expect(err).toBeInstanceOf(Error);
          expect(err.message).toStrictEqual('fake error');
          resolve();
        }
      });
    });
    it('should can custom condition', () => {
      return new Promise(async (resolve) => {
        {
          const mock = new Mock1();
          const promises = [
            mock.func5('/hoge', 1),
            mock.func5('/hoge', 1),
            mock.func5('/hoge', 2),
            mock.func5('/hoge', 2),
          ];
          const [a1, a2, a3, a4] = await Promise.all(promises);
          expect(a1).toStrictEqual({ url: '/hoge1' });
          expect(a2).toStrictEqual({ url: '/hoge1' });
          expect(a3).toStrictEqual({ url: '/hoge1' });
          expect(a4).toStrictEqual({ url: '/hoge1' });
          expect(a1 === a2).toStrictEqual(false);
          expect(mock.count5).toStrictEqual(1);
        }
        {
          const mock = new Mock1();
          const promises = [
            mock.func6('/hoge', 1),
            mock.func6('/hoge', 1),
            mock.func6('/hoge', 2),
            mock.func6('/hoge', 2),
          ];
          const [a1, a2, a3, a4] = await Promise.all(promises);
          expect(a1).toStrictEqual({ url: '/hoge1' });
          expect(a2).toStrictEqual({ url: '/hoge1' });
          expect(a3).toStrictEqual({ url: '/hoge2' });
          expect(a4).toStrictEqual({ url: '/hoge2' });
          expect(a1 === a2).toStrictEqual(true);
          expect(mock.count6).toStrictEqual(2);
        }
        resolve();
      });
    });
    it('should can delay', () => {
      return new Promise(async (resolve) => {
        const mock = new Mock1();
        const promises = [
          mock.func7('/hoge'),
          mock.func7('/hoge'),
          mock.func7('/hoge'),
          mock.func7('/hoge'),
        ];
        expect(mock.count7).toStrictEqual(0);
        const allPromise = Promise.all(promises);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        expect(mock.count7).toStrictEqual(0);
        const [a1, a2, a3, a4] = await allPromise;
        expect(a1).toStrictEqual({ url: '/hoge' });
        expect(a2).toStrictEqual({ url: '/hoge' });
        expect(a3).toStrictEqual({ url: '/hoge' });
        expect(a4).toStrictEqual({ url: '/hoge' });
        expect(a1 === a2).toStrictEqual(false);
        expect(mock.count7).toStrictEqual(1);
        resolve();
      });
    });

    it('should can wait for all consecutive requests when setting the delay', () => {
      return new Promise(async (resolve) => {
        const mock = new Mock1();
        mock.func8('/hoge');
        await wait(250);
        expect(mock.count8).toStrictEqual(0);
        mock.func8('/hoge');
        await wait(250);
        expect(mock.count8).toStrictEqual(0);
        await wait(300);
        expect(mock.count8).toStrictEqual(1);
        await wait(500);
        expect(mock.count8).toStrictEqual(1);
        resolve();
      });
    });
  });
});
