import 'jest';

import { createCombinerContext } from '../src/combiner-context';

describe('module:combiner-context', () => {
  describe('createAsyncCombinerContext()', () => {
    it('should has members', () => {
      const ctx = createCombinerContext();
      expect(ctx.combine).toBeInstanceOf(Function);
    });
    it('should pass options', () => {
      expect(createCombinerContext({}).combine).toBeInstanceOf(Function);
      expect(createCombinerContext({ clone: true }).combine).toBeInstanceOf(
        Function,
      );
      expect(createCombinerContext({ clone: false }).combine).toBeInstanceOf(
        Function,
      );
    });
  });
});
