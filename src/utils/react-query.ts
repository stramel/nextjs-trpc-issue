import transformer from 'superjson';
import {
  defaultShouldDehydrateQuery,
  QueryClient
} from '@tanstack/react-query';

/**
 * Determines the delay by doubling the previous attempt's delay
 * Baseline is 500ms compounding to 1000ms then 2000ms.
 */
function getRetryDelay(attemptIndex: number) {
  const RETRY_DELAY_BASE = 500;
  return RETRY_DELAY_BASE * 2 ** attemptIndex;
}

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      dehydrate: {
        serializeData: transformer.serialize,
        /**
         * Include pending queries in dehydration. This allows us to prefetch in RSC and send promises over the RSC boundary.
         */
        shouldDehydrateQuery: (query) => {
          const shouldDehydrate = defaultShouldDehydrateQuery(query) || query.state.status === 'pending';
          console.debug('[DEBUG] shouldDehydrate:', shouldDehydrate);
          return shouldDehydrate;
        },
      },
      hydrate: {
        deserializeData: transformer.deserialize,
      },
      mutations: {
        retry: 3,
        retryDelay: getRetryDelay,
      },
      queries: {
        /**
         * TODO: Remove these refetch overrides once we have fully migrated to the new hydration method
         * preventing `refetchOnMount` and `refetchOnWindowFocus` is needed for now so
         * we don't make `/pay/api` requests while our react-cache is being hydrated from
         * nextjs.
         * @see {@link https://tanstack.com/query/latest/docs/framework/react/guides/important-defaults}
         * @see {@link https://tanstack.com/query/latest/docs/framework/react/guides/window-focus-refetching}
         */
        refetchOnMount: false,
        refetchOnWindowFocus: false,

        retry: 0,
        retryDelay: getRetryDelay,

        /**
         * Since queries are prefetched on the server, we set a stale time so that queries aren't immediately re-fetched on the client
         */
        staleTime: 30 * 1000,
      },
    },
  });
