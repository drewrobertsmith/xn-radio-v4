
import { Program, Clip } from "@/types/types";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
const ORG_ID = process.env.EXPO_PUBLIC_ORG_ID;

if (!BASE_URL || !ORG_ID) {
  throw new Error("BASE_URL and ORG_ID must be defined in environment variables");
}

const api = {
  get: async <T>(path: string): Promise<T> => {
    const url = `${BASE_URL}/orgs/${ORG_ID}${path}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Network response was not okay for path: ${path}`);
    }
    return response.json();
  },
};

export const fetchClipsById = async (id: Program["Id"]): Promise<Clip[]> => {
  const data = await api.get<{ Clips: Clip[] }>(`/programs/${id}/clips`);
  return data.Clips.length > 0 ? data.Clips : [];
};

export const fetchIndividualClipById = async (id: Clip["Id"]): Promise<Clip> => {
  return api.get<Clip>(`/clips/${id}`);
};

export const fetchAllPodcasts = async (): Promise<Program[]> => {
  const data = await api.get<{ Programs: Program[] }>("/programs");
  const networkFilteredData = data.Programs.filter(
    (n: Program) => n.Network === "XN Radio",
  );
  return networkFilteredData;
};
