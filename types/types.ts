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
