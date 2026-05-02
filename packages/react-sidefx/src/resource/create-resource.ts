import { use, useCallback, useSyncExternalStore } from "react";
import type { Resource } from "./types";

/**
 * Creates a resource that manages asynchronous data fetching and caching.
 * @example
 * ```tsx
 * import { createResource } from "react-sidefx";
 *
 * import { getUser } from "./api";
 *
 * const resource = createResource(getUser, "user");
 * ```
 *
 * @param {function} fn - The function that fetches the data.
 * @param {string} resourceName - An optional name for the resource.
 * @returns {object} A resource object with `use` and `unwatch` methods.
 */
export function createResource<TInput, TOutput>(
  fn: (input: TInput) => Promise<TOutput>,
  resourceName?: string,
): Resource<TInput, TOutput> {
  const resourceMap = new Map<string, Promise<TOutput>>();
  const watchers = new Map<string, Array<() => void>>();

  const resourcePrefix = resourceName ?? Math.random().toString(16).slice(2);
  const createKey = (input: TInput) => {
    return `__${resourcePrefix}__${JSON.stringify(input)}`;
  };

  const get = (input: TInput) => {
    const key = createKey(input);
    let promise = resourceMap.get(key);
    if (!promise) {
      promise = fn(input);
      resourceMap.set(key, promise);
    }
    return promise;
  };

  const emit = (key: string) => {
    const currentWatchers = watchers.get(key);
    if (currentWatchers) {
      currentWatchers.forEach((cb) => void cb());
    }
  };

  const watch = (key: string, cb: () => void) => {
    const currentWatchers = watchers.get(key) ?? [];
    watchers.set(key, [...currentWatchers, cb]);
  };

  const unwatch = (key: string, cb: () => void) => {
    const currentWatchers = watchers.get(key);
    if (currentWatchers) {
      watchers.set(
        key,
        currentWatchers.filter((w) => w !== cb),
      );
    }
  };

  return {
    get: async (input: TInput) => {
      return get(input);
    },
    use: (input: TInput) => {
      const key = createKey(input);

      const subscribe = useCallback(
        (cb: () => void) => {
          watch(key, cb);
          return () => unwatch(key, cb);
        },
        [key],
      );

      const promise = useSyncExternalStore(subscribe, () => get(input));

      return use(promise);
    },
    discard: (input: TInput) => {
      resourceMap.delete(createKey(input));
    },
    refresh: (input: TInput) => {
      const key = createKey(input);
      resourceMap.set(key, fn(input));
      emit(key);
    },
  };
}
