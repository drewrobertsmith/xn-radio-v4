import { Clip } from "@/types/types";
import { useQuery } from "@tanstack/react-query";

const fetchIndividualClipById = async (id: Clip["Id"]): Promise<Clip> => {
  console.log("Individual Clip Network REquest Made");

  const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
  if (!BASE_URL) {
    console.error("No BASE_URL defined!");
  }

  const ORG_ID = process.env.EXPO_PUBLIC_ORG_ID;
  if (!ORG_ID) {
    console.error("No ORG_ID defined!");
  }

  const url = `${BASE_URL}/orgs/${ORG_ID}`;

  const response = await fetch(url + `/clips/${id}`);

  if (!response.ok) {
    throw new Error("Network REsponse not okay");
  }
  const clip = await response.json();

  return clip;
};

export const useIndividualClip = (id: Clip["Id"]) => {
  return useQuery({
    queryKey: ["xn radio, individual clip", id],
    queryFn: () => fetchIndividualClipById(id),
  });
};
