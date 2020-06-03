import 'jest';
import {
  isIterableObject,
  isConditionValue,
  traverseAndFlatten,
  DefaultConditionName,
  flattenCondition,
  createCondition,
  isSameFlattendCondition,
} from '../src/schemes';

describe('module:schemes', () => {
  describe('isIterableObject()', () => {
    it('Must be `true` when passed an array', () => {
      expect(isIterableObject([])).toStrictEqual(true);
      expect(
        isIterableObject([1, '2', true, null, { hoge: true }]),
      ).toStrictEqual(true);
      expect(isIterableObject([new Date(), Date, class Hoge {}])).toStrictEqual(
        true,
      );
    });
    it('Must be `true` when passed an plain object', () => {
      expect(isIterableObject({})).toStrictEqual(true);
      expect(
        isIterableObject({
          v1: 1,
          v2: '2',
          v3: true,
          v4: null,
          v5: { hoge: true },
        }),
      ).toStrictEqual(true);
    });
    it('Must be `false` when passed an `undefined`', () => {
      expect(isIterableObject()).toStrictEqual(false);
    });
    it('Must be `false` when passed an `null`', () => {
      expect(isIterableObject(null)).toStrictEqual(false);
    });
    it('Must be `false` when passed an `string`', () => {
      expect(isIterableObject('1')).toStrictEqual(false);
      expect(isIterableObject('')).toStrictEqual(false);
    });
    it('Must be `false` when passed an `number`', () => {
      expect(isIterableObject(1)).toStrictEqual(false);
      expect(isIterableObject(0)).toStrictEqual(false);
      expect(isIterableObject(-1)).toStrictEqual(false);
    });
    it('Must be `false` when passed an `Date`', () => {
      expect(isIterableObject(new Date())).toStrictEqual(false);
    });
    it('Must be `false` when passed an `Symbol`', () => {
      expect(isIterableObject(Symbol('fuga'))).toStrictEqual(false);
    });
    it('Must be `false` when passed an `global` (node self)', () => {
      expect(isIterableObject(self)).toStrictEqual(false);
    });
    it('Must be `false` when passed an constructor', () => {
      expect(isIterableObject(String)).toStrictEqual(false);
      expect(isIterableObject(Date)).toStrictEqual(false);
      expect(isIterableObject(class Hoge {})).toStrictEqual(false);
    });
  });

  describe('isConditionValue()', () => {
    it('Must be `true` when passed an `string`', () => {
      expect(isConditionValue('')).toStrictEqual(true);
      expect(isConditionValue('-1')).toStrictEqual(true);
      expect(isConditionValue('0')).toStrictEqual(true);
    });
    it('Must be `true` when passed an `number`', () => {
      expect(isConditionValue(0)).toStrictEqual(true);
      expect(isConditionValue(-1)).toStrictEqual(true);
      expect(isConditionValue(0)).toStrictEqual(true);
      expect(isConditionValue(Infinity)).toStrictEqual(true);
    });
    it('Must be `true` when passed an `boolean`', () => {
      expect(isConditionValue(true)).toStrictEqual(true);
      expect(isConditionValue(false)).toStrictEqual(true);
    });
    it('Must be `true` when passed an `undefined`', () => {
      expect(isConditionValue()).toStrictEqual(true);
      expect(isConditionValue(undefined)).toStrictEqual(true);
    });
    it('Must be `true` when passed an `null`', () => {
      expect(isConditionValue(null)).toStrictEqual(true);
    });
    it('Must be `true` when passed an `Date`', () => {
      expect(isConditionValue(new Date())).toStrictEqual(true);
    });

    it('Must be `false` when passed an array', () => {
      expect(isConditionValue([])).toStrictEqual(false);
      expect(
        isConditionValue([1, '2', true, null, { hoge: true }]),
      ).toStrictEqual(false);
      expect(isConditionValue([new Date(), Date, class Hoge {}])).toStrictEqual(
        false,
      );
    });
    it('Must be `false` when passed an plain object', () => {
      expect(isConditionValue({})).toStrictEqual(false);
      expect(
        isConditionValue({
          v1: 1,
          v2: '2',
          v3: true,
          v4: null,
          v5: { hoge: true },
        }),
      ).toStrictEqual(false);
    });
    it('Must be `false` when passed an `Symbol`', () => {
      expect(isConditionValue(Symbol('fuga'))).toStrictEqual(false);
    });
    it('Must be `false` when passed an `global` (node self)', () => {
      expect(isConditionValue(self)).toStrictEqual(false);
    });
    it('Must be `false` when passed an constructor', () => {
      expect(isConditionValue(String)).toStrictEqual(false);
      expect(isConditionValue(Date)).toStrictEqual(false);
      expect(isConditionValue(class Hoge {})).toStrictEqual(false);
    });
  });

  describe('traverseAndFlatten()', () => {
    it('should be defaulted object', () => {
      expect(traverseAndFlatten(undefined, {})).toStrictEqual({
        [DefaultConditionName]: undefined,
      });
      expect(traverseAndFlatten(null, {})).toStrictEqual({
        [DefaultConditionName]: null,
      });
      expect(traverseAndFlatten(true, {})).toStrictEqual({
        [DefaultConditionName]: true,
      });
      expect(traverseAndFlatten(false, {})).toStrictEqual({
        [DefaultConditionName]: false,
      });
      expect(traverseAndFlatten(0, {})).toStrictEqual({
        [DefaultConditionName]: 0,
      });
      expect(traverseAndFlatten('xyz', {})).toStrictEqual({
        [DefaultConditionName]: 'xyz',
      });
      const dt1 = new Date();
      expect(traverseAndFlatten(dt1, {})).toStrictEqual({
        [DefaultConditionName]: dt1.toString(),
      });
    });
    it('should be iterate array', () => {
      expect(traverseAndFlatten([], {})).toStrictEqual({});
      expect(traverseAndFlatten([0], {})).toStrictEqual({ '0': 0 });
      expect(traverseAndFlatten(['1'], {})).toStrictEqual({ '0': '1' });
      const dt1 = new Date();
      expect(
        traverseAndFlatten([0, '1', true, false, null, undefined, dt1], {}),
      ).toStrictEqual({
        '0': 0,
        '1': '1',
        '2': true,
        '3': false,
        '4': null,
        '5': undefined,
        '6': dt1.toString(),
      });
    });
    it('should be iterate object', () => {
      expect(traverseAndFlatten({}, {})).toStrictEqual({});
      expect(traverseAndFlatten({ k1: 0 }, {})).toStrictEqual({ k1: 0 });
      const dt1 = new Date();
      expect(
        traverseAndFlatten(
          {
            k1: 0,
            k2: '1',
            k3: true,
            k4: false,
            k5: null,
            k6: undefined,
            k7: dt1,
          },
          {},
        ),
      ).toStrictEqual({
        k1: 0,
        k2: '1',
        k3: true,
        k4: false,
        k5: null,
        k6: undefined,
        k7: dt1.toString(),
      });
    });
    it('must be repeated recursively', () => {
      expect(
        traverseAndFlatten(
          [
            { k1: 1, k2: '2', k3: [0, '1'], k4: class Hoge {} },
            {
              hoge: {
                fuga: [
                  String,
                  1,
                  {
                    piyo: true,
                  },
                  Symbol('test'),
                ],
              },
            },
          ],
          {},
        ),
      ).toStrictEqual({
        '0.k1': 1,
        '0.k2': '2',
        '0.k3.0': 0,
        '0.k3.1': '1',
        '1.hoge.fuga.1': 1,
        '1.hoge.fuga.2.piyo': true,
      });
    });
  });
  describe('flattenCondition()', () => {
    it('must be repeated recursively', () => {
      expect(
        flattenCondition([
          { k1: 1, k2: '2', k3: [0, '1'] },
          {
            hoge: {
              fuga: [
                1,
                {
                  piyo: true,
                },
              ],
            },
          },
        ]),
      ).toStrictEqual({
        '0.k1': 1,
        '0.k2': '2',
        '0.k3.0': 0,
        '0.k3.1': '1',
        '1.hoge.fuga.0': 1,
        '1.hoge.fuga.1.piyo': true,
      });
    });
  });
  describe('createCondition()', () => {
    it('must be repeated recursively', () => {
      expect(
        createCondition(
          [
            { k1: 1, k2: '2', k3: [0, '1'], k4: class Hoge {} },
            {
              hoge: {
                fuga: [
                  String,
                  1,
                  {
                    piyo: true,
                  },
                  Symbol('test'),
                ],
              },
            },
          ],
          {},
        ),
      ).toStrictEqual({
        '0.0.k1': 1,
        '0.0.k2': '2',
        '0.0.k3.0': 0,
        '0.0.k3.1': '1',
        '0.1.hoge.fuga.1': 1,
        '0.1.hoge.fuga.2.piyo': true,
      });
    });
  });
  describe('isSameFlattendCondition()', () => {
    it('should be `true`', () => {
      expect(isSameFlattendCondition({}, {})).toStrictEqual(true);
      expect(isSameFlattendCondition({ hoge: 1 }, { hoge: 1 })).toStrictEqual(
        true,
      );
      expect(
        isSameFlattendCondition(
          { k1: 1, k2: '2', k3: null, k4: undefined, k5: false },
          { k1: 1, k2: '2', k3: null, k4: undefined, k5: false },
        ),
      ).toStrictEqual(true);
    });
    it('should be `false`', () => {
      expect(isSameFlattendCondition({}, { hoge: 1 })).toStrictEqual(false);
      expect(
        isSameFlattendCondition({ hoge: undefined }, { hoge: null }),
      ).toStrictEqual(false);
      expect(
        isSameFlattendCondition({ hoge: 1 }, { hoge: 1, fuga: 2 }),
      ).toStrictEqual(false);
      expect(
        isSameFlattendCondition({ hoge: 1, fuga: 2 }, { hoge: 1 }),
      ).toStrictEqual(false);
    });
  });
});
