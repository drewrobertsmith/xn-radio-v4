import { Clip, Program } from "@/types/types";
import { useQuery } from "@tanstack/react-query";

const fetchClipsById = async (id: Program["Id"]): Promise<Clip[]> => {
  console.log("Clip network request made");

  const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
  if (!BASE_URL) {
    console.error("No BASE_URL defined!");
  }

  const ORG_ID = process.env.EXPO_PUBLIC_ORG_ID;
  if (!ORG_ID) {
    console.error("No ORG_ID defined!");
  }

  const url = `${BASE_URL}/orgs/${ORG_ID}`;

  const response = await fetch(url + `/programs/${id}/clips`);

  if (!response.ok) {
    throw new Error("Network REsponse not okay");
  }
  const json = await response.json();

  if (json.Clips.length === 0) {
    return [];
  }

  return json.Clips;
};

export const useClips = (id: Program["Id"]) => {
  return useQuery({
    queryKey: ["xn radio, clips", id],
    queryFn: () => fetchClipsById(id),
  });
};
