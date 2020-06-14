import {
  AsyncCombinerFlattenedCondition,
  flattenCondition,
  isSameFlattendCondition,
} from './schemes';

/**
 * This is the type of method that actually does the asynchronous work.
 * All methods that use decorators in this library must match this type.
 */
export type AsyncCombinerExecutor<T = any> = (...params: any) => Promise<T>;

/**
 * Options that can be specified when creating the context object
 */
export interface AsyncCombinerContextOptions {
  /**
   * Specify "false" if you do not want to duplicate the payload object passed when the asynchronous process succeeds. The default is "true" and is always duplicated. This is to prevent the value used in other logic from being changed unintentionally when the implementation side that receives the payload object modifies the object.
   */
  clone?: boolean;

  /**
   * When delaying the start of asynchronous processing, specify the waiting time (ms). This option is useful in situations where users frequently make asynchronous operation change requests.
   */
  delay?: number;
}

/** @private */
interface AsyncCombinerResolver {
  resolve: Function;
  reject: Function;
}

/** @private */
interface AsyncCombinerRunningDelaySettings {
  /**
   * Return value of setTimeout method
   */
  timer: number | null;

  /**
   * Shows `true` when the delayed wait is completed and the asynchronous process is actually started.
   */
  triggered: boolean;

  /**
   * Waits the specified delay milliseconds before executing the request. If it is already in the delay wait state, the wait time is updated.
   */
  run: () => void;

  /**
   * Releases the deferred callback.
   */
  clear: () => void;
}

/** @private */
interface AsyncCombinerRunning {
  condition: AsyncCombinerFlattenedCondition;
  resolvers: AsyncCombinerResolver[];
  clone?: boolean;
  exec: () => void;
  delay: AsyncCombinerRunningDelaySettings | null;
}

/**
 * Context object for processing asynchronous processing.
 * Classes and decorators in this library always create this context.
 */
export function createCombinerContext(
  options: AsyncCombinerContextOptions = {},
) {
  const runnings: AsyncCombinerRunning[] = [];
  const { clone: useClonePayload = true } = options;

  /**
   * It is a method that receives a request for asynchronous processing. If the same condition has already been executed, two promise resolution methods, resolve and reject, are stacked in the queue and wait for the already executed promise to be resolved.
   * @param condition Condition object for executing asynchronous process. This library combines the same conditions for asynchronous processing based on this condition. You can pass arbitrary parameters, but instances such as `Function` and `Symbol` are ignored. `Date` instance is adopted as a character string because it is general and is often used in asynchronous processing.
   * @param executor Please pass the method that actually performs the asynchronous process.
   * @param combineClonePayload Specify "false" if you do not want to duplicate the payload object passed when the asynchronous process succeeds. The default is "true" and is always duplicated. This is to prevent the value used in other logic from being changed unintentionally when the implementation side that receives the payload object modifies the object. If not specified, the value determined at context creation time is used as the default.
   */
  function combine<T = any>(
    condition: any,
    executor: AsyncCombinerExecutor<T>,
    combineClonePayload: boolean = useClonePayload,
    delay: number | undefined = options.delay,
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      const resolver: AsyncCombinerResolver = { resolve, reject };
      const flattenedCondition = flattenCondition(condition);
      const sameRunning = runnings.find((r) =>
        isSameFlattendCondition(r.condition, flattenedCondition),
      );

      if (sameRunning) {
        if (sameRunning.delay && !sameRunning.delay.triggered) {
          sameRunning.delay.run();
        }
        sameRunning.resolvers.push(resolver);
        return;
      }

      const newRunning: AsyncCombinerRunning = {
        condition: flattenedCondition,
        resolvers: [resolver],
        clone: combineClonePayload,
        exec: () => {
          if (newRunning.delay) {
            newRunning.delay.clear();
            newRunning.delay.triggered = true;
          }
          executor()
            .then((payload) => {
              resolveResolvers(flattenedCondition, 'resolve', payload);
            })
            .catch((err) => {
              resolveResolvers(flattenedCondition, 'reject', err);
            });
        },
        delay: delay
          ? {
              timer: null,
              triggered: false,
              run() {
                this.clear();
                this.timer = setTimeout(newRunning.exec, delay) as any;
              },
              clear() {
                if (this.timer !== null) {
                  clearTimeout(this.timer);
                  this.timer = null;
                }
              },
            }
          : null,
      };

      runnings.push(newRunning);

      try {
        if (newRunning.delay) {
          newRunning.delay.run();
        } else {
          newRunning.exec();
        }
      } catch (err) {
        /* istanbul ignore next */
        resolveResolvers(flattenedCondition, 'reject', err);
      }
    });
  }

  /**
   * Resolves all pending promises that match the specified condition.
   * @param flattenedCondition
   * @param type Specify `resolve` for normal resolution and `reject` for rejection due to exceptions.
   * @param payload Specify the payload to be delivered regardless of normal resolution or exception resolution.
   */
  function resolveResolvers(
    flattenedCondition: AsyncCombinerFlattenedCondition,
    type: 'resolve' | 'reject',
    payload?: any,
  ) {
    const running = runnings.find((r) =>
      isSameFlattendCondition(r.condition, flattenedCondition),
    );
    /* istanbul ignore next */
    if (!running) return;
    const isResolve = type === 'resolve';
    running.resolvers.forEach((resolver) => {
      const _payload =
        running.clone && isResolve && payload && typeof payload === 'object'
          ? JSON.parse(JSON.stringify(payload))
          : payload;
      resolver[type](_payload);
    });
    running.resolvers = [];
    runnings.splice(runnings.indexOf(running), 1);
  }

  return {
    combine,
    /** @private */
    _runnings: runnings,
    /** @private */
    _resolveResolvers: resolveResolvers,
  };
}

/**
 * Context for handling asynchronous process
 */
export type AsyncCombinerContext = ReturnType<typeof createCombinerContext>;
