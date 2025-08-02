import { Program } from "@/types/types";
import { fetchClipsById } from "@/utils/api";
import { queryConstants } from "@/utils/constants";
import { useQuery } from "@tanstack/react-query";

export const useClips = (id: Program["Id"]) => {
  return useQuery({
    queryKey: ["xn radio, clips", id],
    queryFn: () => fetchClipsById(id),
    staleTime: queryConstants.staleTime.hour,
  });
};
