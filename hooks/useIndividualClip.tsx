import { Clip } from "@/types/types";
import { fetchIndividualClipById } from "@/utils/api";
import { queryConstants } from "@/utils/constants";
import { useQuery } from "@tanstack/react-query";

export const useIndividualClip = (id: Clip["Id"]) => {
  return useQuery({
    queryKey: ["xn radio, individual clip", id],
    queryFn: () => fetchIndividualClipById(id),
    staleTime: queryConstants.staleTime.hour,
  });
};
