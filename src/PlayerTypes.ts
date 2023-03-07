export type TrackInfo = {
  id: number;
  name: string;
};

export type VideoInfo = {
  duration: number;
  videoSize: {
    width: number;
    height: number;
  };
  audioTracks?: TrackInfo[];
  textTracks?: TrackInfo[];
};

export type ProgressInfo = {
  currentTime: number;
};
