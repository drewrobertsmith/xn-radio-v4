import { Program } from "@/types/types";
import { useQuery } from "@tanstack/react-query";

const fetchAllPodcasts = async (): Promise<Program[]> => {
  console.log("network request made!");

  const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
  if (!BASE_URL) {
    console.error("No BASE_URL defined!");
  }

  const ORG_ID = process.env.EXPO_PUBLIC_ORG_ID;
  if (!ORG_ID) {
    console.error("No ORG_ID defined!");
  }

  const url = `${BASE_URL}/orgs/${ORG_ID}`;

  const response = await fetch(url + "/programs");
  if (!response.ok) {
    throw new Error("Network response was not okay");
  }
  const json = await response.json();

  if (json.Programs.length === 0) {
    return [];
  }

  const networkFilteredData = json.Programs.filter(
    (n: Program) => n.Network === "XN Radio",
  );
  return networkFilteredData;
};

export const usePodcasts = () => {
  return useQuery({
    queryKey: ["xn radio, podcasts", "all"],
    queryFn: fetchAllPodcasts,
  });
};
