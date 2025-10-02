import { Program } from "../types/types";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
const ORG_ID = process.env.EXPO_PUBLIC_ORG_ID;

export const fetchContentFromOmny = async (): Promise<Program[]> => {
  if (!BASE_URL) {
    console.error("No BASE_URL defined!");
  }
  if (!ORG_ID) {
    console.error("No ORG_ID defined!");
  }

  console.log("Begin fetching for Programs....");

  const url = `${BASE_URL}/orgs/${ORG_ID}/programs`;

  console.log("Fetching from URL:", url);

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("Network response was not okay");
    }

    const json = await res.json();

    // console.log("Raw API Response:", JSON.stringify(json, null, 2));

    if (!json.Programs || json.Programs.length === 0) {
      console.log("The 'Programs' array is missing or empty in the response.");
      return [];
    }
    const networkFilteredPrograms = json.Programs.filter(
      (n: Program) => n.Network === "XN Radio",
    );

    console.log("Filtered Programs:", networkFilteredPrograms);

    console.log(
      `Found ${networkFilteredPrograms.length} programs after filtering`,
    );

    return networkFilteredPrograms;
  } catch (error) {
    console.error("An error occurred in fetchContentFromOmny:", error);
    throw error;
  }
};
