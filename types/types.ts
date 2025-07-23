export interface Program {
  Id: string;
  Name: string;
  Description: string;
  Author: string;
  ArtworkUrl: string;
  Network: string;
}

export interface Clip {
  Id: string;
  Title: string;
  Description: string;
  ImageUrl: string;
  AudioUrl: string;
  DurationSeconds: number;
  PublishedUtc: string;
}

export interface Station {
  Id: string;
  callLetters: string;
  applogoM?: string;
  stream: string;
  frequency?: number;
  band?: string;
  fallbackstream?: string;
  name: string;
  backgroundColor?: string;
  lat?: number | null;
  lng?: number | null;
}
