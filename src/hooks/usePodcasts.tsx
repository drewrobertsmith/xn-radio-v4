import { useQuery } from "@tanstack/react-query";
import { fetchContentFromOmny } from "../api/fetchContentFromOmny";

export const usePodcasts = () => {
  return useQuery({
    queryKey: ["xn radio, podcasts", "all"],
    queryFn: fetchContentFromOmny,
    staleTime: 1000 * 60 * 60 * 24, //every 24 hours
  });
};
