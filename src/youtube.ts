declare global {
  var YT: IframeApiType;
  var onYouTubeIframeAPIReady: () => void;
}

export interface YouTubePlayer {
  cueVideoById({
    videoId,
    startSeconds,
    endSeconds,
  }: {
    videoId: string;
    startSeconds?: number;
    endSeconds?: number;
  }): void;
  seekTo(startSeconds: number, allowSeekAhead: boolean): void;
  playVideo(): void;
}

export interface IframeApiType {
  Player: {
    new (
      elementId: string,
      options: {
        videoId: string;
        events: {
          onReady: (event: { target: YouTubePlayer }) => void;
          onStateChange: (event: {
            data: PlayerState;
            target: YouTubePlayer;
          }) => void;
        };
      },
    ): YouTubePlayer;
  };
}

export const PlayerStates = {
  UNSTARTED: -1,
  ENDED: 0,
  PLAYING: 1,
  PAUSED: 2,
  BUFFERING: 3,
  VIDEO_CUED: 5,
} as const;

export type PlayerState = (typeof PlayerStates)[keyof typeof PlayerStates];
