import { audio$ } from "@/state/audio";
import { Metadata, Station } from "@/types/types";
import { use$ } from "@legendapp/state/react";
import { useQuery } from "@tanstack/react-query";
import { XMLParser } from "fast-xml-parser";

interface Property {
  name: string;
  value: string;
}

interface NowPlayingInfo {
  property: Property[];
}

interface NowPlayingInfoList {
  "nowplaying-info": NowPlayingInfo;
}

interface ParsedXMLData {
  "nowplaying-info-list": NowPlayingInfoList;
}

const options = {
  ignoreAttributes: false,
  ignoreDeclaration: true,
  ignorePi: true,
  cdataPropName: "value",
  attributeNamePrefix: "",
  transformAttribute: (attrName, attrValue) => {
    return { name: attrValue };
  },
  transformCdata: (propName, propValue) => {
    return { value: propValue };
  },
};

const fetchLiveMetadataFromTriton = async (
  tritonId: Station["callLetters"],
  numberToFetch: number,
): Promise<Metadata> => {
  const url = "https://np.tritondigital.com/public/nowplaying";
  const response = await fetch(
    `${url}?mountName=${tritonId}&numberToFetch=${numberToFetch}`,
  );

  const result = await response.text();
  const parser = new XMLParser(options);

  const parsedData = parser.parse(result) as ParsedXMLData;
  const nowplayingInfo = parsedData["nowplaying-info-list"]["nowplaying-info"];

  const properties = nowplayingInfo.property;

  const getValue = (propertyName: string): string => {
    const prop = properties.find((p) => p.name === propertyName);
    return prop ? prop.value : "N/A";
  };

  const jsonData: Metadata = {
    cue_title: getValue("cue_title"),
    // track_album_name: getValue("track_album_name"),
    track_artist_name: getValue("track_artist_name"),
  };

  return jsonData;
};

export const useMetadata = (
  tritonId: Station["callLetters"],
  numberToFetch: number,
) => {
  const { playbackState, id } = use$(() => {
    const currentTrack = audio$.currentTrack.get();
    return {
      playbackState: audio$.playbackState.get(),
      id: currentTrack?.id,
    };
  });

  return useQuery({
    queryKey: ["xn radio, station metadata", tritonId],
    queryFn: () => fetchLiveMetadataFromTriton(tritonId, numberToFetch),
    refetchInterval: 1000 * 15,
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 60 * 5,
    enabled: playbackState === "playing" && id === "XNRD",
  });
};
