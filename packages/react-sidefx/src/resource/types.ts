export interface Resource<TInput, TOutput> {
  /**
   *
   * @param input - The arguments for the `resourceFn`
   * @returns It returns the cached promise if available, otherwise it will trigger the `resourceFn` and return the new promise
   */
  get: (input: TInput) => Promise<TOutput>;

  /**
   * A hook generated based on the resource, usage of this will suspend the component and trigger nearest error boundary
   * @param {TInput} input - The arguments for the `resourceFn`
   * @returns {TOutput} The resolved value of the `resourceFn`
   */
  use: (input: TInput) => TOutput;

  /**
   * A utility to clear the cache for a specific input
   * @param {TInput} input - The arguments for the `resourceFn`
   */
  discard: (input: TInput) => void;

  /**
   * A utility to refresh the cache for a specific input by re-triggering the `resourceFn`. This will also retrigger a render if some component is using `resource.use()`
   * @param {TInput} input - The arguments for the `resourceFn`
   */
  refresh: (input: TInput) => void;
}
