import {
  createCombinerContext,
  AsyncCombinerContextOptions,
} from './combiner-context';

import { createCondition } from './schemes';

/**
 * This decorator will automatically generate asynchronous process execution conditions from the method arguments unless specified. In most cases that's fine, but if you want to customize this process, you can overwrite it according to this type.
 * The order and types of the arguments are all the same as for methods that use decorators.
 */
export type CombineConditionFactory = (...args: any[]) => any;

/**
 * This is an option when setting the decorator.
 */
export interface DecoratorOptions extends AsyncCombinerContextOptions {
  /**
   * This decorator will automatically generate asynchronous process execution conditions from the method arguments unless specified. In most cases that's fine, but if you want to customize this process, you can overwrite it according to this type.
   * The order and types of the arguments are all the same as for methods that use decorators.
   */
  createCondition?: CombineConditionFactory;
}

/**
 * It is a decorator for combining asynchronous processes.
 * @param optionsOrconditionFactory Specify the option when setting the decorator or the method that customizes the asynchronous process execution condition.
 */
export function Combine<T = any>(
  optionsOrconditionFactory?: DecoratorOptions | CombineConditionFactory,
) {
  const options: DecoratorOptions =
    typeof optionsOrconditionFactory === 'function'
      ? {
          createCondition: optionsOrconditionFactory,
        }
      : optionsOrconditionFactory || {};

  const { createCondition: conditionFactory = createCondition } = options;

  const Decorator = (
    target: Object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<T>>,
  ) => {
    let originalFunc = descriptor.value;

    /* istanbul ignore next */
    if (!originalFunc) throw new TypeError('missing combine function');

    const ctx = createCombinerContext(options);

    descriptor.value = function asyncCombine(...args) {
      const condition = conditionFactory(...args);
      const executor = () => {
        return (originalFunc as Function).call(this, ...args);
      };
      return ctx.combine(condition, executor, options.clone);
    };
  };
  return Decorator;
}
