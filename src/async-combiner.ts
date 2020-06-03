import {
  AsyncCombinerContext,
  createCombinerContext,
} from './combiner-context';

/**
 * Asynchronous processing combine service
 */
export class AsyncCombiner {
  /**
   * Context for handling asynchronous process
   */
  readonly $asyncCombinerContext: AsyncCombinerContext;

  /**
   * @see [AsyncCombinerContext.combine()]
   */
  readonly $asyncCombine: AsyncCombinerContext['combine'];

  constructor() {
    const ctx = createCombinerContext();
    this.$asyncCombinerContext = ctx;
    this.$asyncCombine = ctx.combine;
  }
}
