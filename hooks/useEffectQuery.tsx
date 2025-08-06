import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { Effect } from "effect";
import { ApiClientLive } from "@/utils/api";

export const useEffectQuery = <A, E>(
  effect: Effect.Effect<A, E, ApiClient>,
  queryOptions?: UseQueryOptions<A, E>,
) => {
  const queryFn = () =>
    Effect.runPromise(Effect.provide(effect, ApiClientLive));

  return useQuery({
    ...queryOptions,
    queryFn,
  });
};
