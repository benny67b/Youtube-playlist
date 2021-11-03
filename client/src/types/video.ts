
export interface Video {
  title: string;
  youtubeVideoId: string;
  id: string;
  duration: string;
  index: number
}

export type VideosByKey = Map<string, Video>;

