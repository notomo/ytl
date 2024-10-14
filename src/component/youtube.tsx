import { useEffect, useState } from "react";

declare global {
  var YT: IframeApiType;
  var onYouTubeIframeAPIReady: () => void;
  var onYoutubeStateChange: (event: {
    data: PlayerState;
    target: YouTubePlayer;
  }) => void;
}

export interface YouTubePlayer {
  loadVideoById({
    videoId,
    startSeconds,
    endSeconds,
  }: {
    videoId: string;
    startSeconds?: number;
    endSeconds?: number;
  }): void;
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
  pauseVideo(): void;
  getPlayerState(): PlayerState;
  clearVideo(): void;
  destroy(): void;
  getVideoUrl(): string;
  getDuration(): number;
  getCurrentTime(): number;
  addEventListener(
    event: "onStateChange",
    listener: (event: { target: YouTubePlayer }) => void,
  ): void;
  removeEventListener(
    event: "onStateChange",
    listener: (event: { target: YouTubePlayer }) => void,
  ): void;
}

export interface IframeApiType {
  Player: {
    new (
      elementId: string,
      options: {
        videoId: string;
        width?: string;
        height?: string;
        events: {
          onReady?: (event: { target: YouTubePlayer }) => void;
          onStateChange?: (event: {
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

const playerId = "player";

export function useYoutubePlayer({
  initialVideoId,
  startSeconds,
  endSeconds,
}: {
  initialVideoId: string;
  startSeconds: number;
  endSeconds?: number;
}) {
  const [player, setPlayer] = useState<YouTubePlayer | null>(null);
  const [videoId, setVideoId] = useState(initialVideoId);
  const [duration, setDuration] = useState(0);
  const [playerState, setPlayerState] = useState<PlayerState>(
    PlayerStates.UNSTARTED,
  );

  useEffect(() => {
    window.onYoutubeStateChange = (event) => {
      setPlayerState(event.data);

      switch (event.data) {
        case PlayerStates.ENDED: {
          event.target.seekTo(startSeconds, true);
          event.target.playVideo();
          break;
        }
        case PlayerStates.VIDEO_CUED: {
          setDuration(event.target.getDuration());

          const videoUrl = new URL(event.target.getVideoUrl());
          const v = videoUrl.searchParams.get("v");
          setVideoId(v || initialVideoId);

          setPlayer(event.target);
          event.target.playVideo();
          break;
        }
      }
    };

    if (player !== null) {
      player.cueVideoById({
        videoId,
        startSeconds,
        endSeconds,
      });
      return;
    }

    window.onYouTubeIframeAPIReady = () => {
      new window.YT.Player(playerId, {
        videoId,

        // workaround for tablet
        width: "1000",
        height: "563",

        events: {
          onReady: (event) => {
            event.target.cueVideoById({
              videoId,
              startSeconds,
              endSeconds,
            });
          },
          onStateChange: (event) => {
            window.onYoutubeStateChange(event);
          },
        },
      });
    };

    const head = document.getElementsByTagName("head")[0];
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    head?.appendChild(script);
    return () => {
      head?.removeChild(script);
    };
  }, [videoId, startSeconds, endSeconds, player]);

  return {
    player,
    playerState,
    videoId,
    setVideoId,
    duration,
  };
}

export function YoutubePlayerContainer() {
  return (
    <div className="flex items-center w-full h-full aspect-video">
      {/* xl is workaround for tablet */}
      <div id={playerId} className="xl:w-full xl:h-full" />
    </div>
  );
}
