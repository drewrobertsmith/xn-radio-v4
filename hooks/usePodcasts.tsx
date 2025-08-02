import { fetchAllPodcasts } from "@/utils/api";
import { queryConstants } from "@/utils/constants";
import { useQuery } from "@tanstack/react-query";

export const usePodcasts = () => {
  return useQuery({
    queryKey: ["xn radio, podcasts", "all"],
    queryFn: fetchAllPodcasts,
    staleTime: queryConstants.staleTime.day,
  });
};
