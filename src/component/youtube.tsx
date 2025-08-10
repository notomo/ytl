import { useCallback, useEffect, useRef, useState } from "react";

function getLoopStartTime(
  marks: number[],
  markLoopIndex?: number | null,
  defaultStart?: number,
): number {
  if (markLoopIndex == null) {
    return defaultStart ?? 0;
  }

  const sorted = marks.toSorted((a, b) => a - b);

  if (markLoopIndex === 0) {
    return defaultStart ?? 0;
  }

  if (markLoopIndex < 0 || markLoopIndex > sorted.length) {
    return defaultStart ?? 0;
  }

  return sorted[markLoopIndex - 1] ?? defaultStart ?? 0;
}

function getLoopEndTime(
  marks: number[],
  markLoopIndex?: number | null,
  defaultEnd?: number,
): number {
  if (markLoopIndex == null) {
    return defaultEnd ?? 0;
  }

  const sorted = marks.toSorted((a, b) => a - b);

  if (markLoopIndex < 0 || markLoopIndex > sorted.length) {
    return defaultEnd ?? 0;
  }

  if (markLoopIndex === 0) {
    return sorted.length > 0
      ? (sorted[0] ?? defaultEnd ?? 0)
      : (defaultEnd ?? 0);
  }

  if (markLoopIndex === sorted.length) {
    return defaultEnd ?? 0;
  }

  return sorted[markLoopIndex] ?? defaultEnd ?? 0;
}

declare global {
  var YT: IframeApiType;
  var onYouTubeIframeAPIReady: () => void;
  var onYoutubeStateChange: (event: {
    data: PlayerState;
    target: YouTubePlayer;
  }) => void;
  var onYoutubePlaybackRateChange: (event: {
    data: number;
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
  getAvailablePlaybackRates(): number[];
  setPlaybackRate(suggestedRate: number): void;
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
          onPlaybackRateChange?: (event: {
            data: number;
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
  playbackRate,
  startSeconds,
  endSeconds,
  setPlaybackRate,
  marks = [],
  markLoopIndex,
}: {
  initialVideoId: string;
  playbackRate: number;
  startSeconds: number;
  endSeconds?: number;
  setPlaybackRate: (x: number) => void;
  marks?: number[];
  markLoopIndex?: number | null;
}) {
  const playerRef = useRef<YouTubePlayer | null>(null);
  const [videoId, setVideoId] = useState(initialVideoId);
  const [duration, setDuration] = useState(0);
  const [availablePlaybackRates, setAvailablePlaybackRates] = useState<
    number[]
  >([1]);
  const [playerState, setPlayerState] = useState<PlayerState>(
    PlayerStates.UNSTARTED,
  );
  const savedTimeRef = useRef<number | null>(null);
  const lastMarkLoopIndexRef = useRef<number | null>(markLoopIndex);
  const lastMarksListRef = useRef<number[]>(marks);

  useEffect(() => {
    window.onYoutubeStateChange = (event) => {
      setPlayerState(event.data);

      switch (event.data) {
        case PlayerStates.ENDED: {
          const loopStart = getLoopStartTime(
            marks,
            markLoopIndex,
            startSeconds,
          );
          event.target.seekTo(loopStart, true);
          event.target.playVideo();
          break;
        }
        case PlayerStates.VIDEO_CUED: {
          event.target.setPlaybackRate(playbackRate);
          setAvailablePlaybackRates(event.target.getAvailablePlaybackRates());
          const videoDuration = event.target.getDuration();
          setDuration(videoDuration);

          const videoUrl = new URL(event.target.getVideoUrl());
          const v = videoUrl.searchParams.get("v");
          setVideoId(v || videoId);

          if (savedTimeRef.current !== null) {
            event.target.seekTo(savedTimeRef.current, true);
            savedTimeRef.current = null;
          } else if (markLoopIndex != null && marks.length > 0) {
            const loopStart = getLoopStartTime(
              marks,
              markLoopIndex,
              startSeconds,
            );
            event.target.seekTo(loopStart, true);
          }

          event.target.playVideo();
          break;
        }
      }
    };

    window.onYoutubePlaybackRateChange = (event) => {
      setPlaybackRate(event.data);
    };

    if (playerRef.current !== null) {
      const marksChanged =
        JSON.stringify(lastMarksListRef.current) !== JSON.stringify(marks);
      const markLoopChanged = lastMarkLoopIndexRef.current !== markLoopIndex;

      if (markLoopChanged || marksChanged) {
        savedTimeRef.current = playerRef.current.getCurrentTime();
      }

      const loopStart =
        markLoopIndex != null && marks.length > 0
          ? getLoopStartTime(marks, markLoopIndex, startSeconds)
          : startSeconds;
      const loopEnd =
        markLoopIndex != null && marks.length > 0
          ? getLoopEndTime(marks, markLoopIndex, endSeconds)
          : endSeconds;

      playerRef.current.cueVideoById({
        videoId,
        startSeconds: loopStart,
        endSeconds: loopEnd,
      });
      return;
    }

    window.onYouTubeIframeAPIReady = () => {
      new window.YT.Player(playerId, {
        videoId,

        events: {
          onReady: (event) => {
            playerRef.current = event.target;
            const loopStart =
              markLoopIndex != null && marks.length > 0
                ? getLoopStartTime(marks, markLoopIndex, startSeconds)
                : startSeconds;
            const loopEnd =
              markLoopIndex != null && marks.length > 0
                ? getLoopEndTime(marks, markLoopIndex, endSeconds)
                : endSeconds;

            event.target.cueVideoById({
              videoId,
              startSeconds: loopStart,
              endSeconds: loopEnd,
            });
          },
          onStateChange: (event) => {
            window.onYoutubeStateChange(event);
          },
          onPlaybackRateChange: (event) => {
            window.onYoutubePlaybackRateChange(event);
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
  }, [
    videoId,
    startSeconds,
    endSeconds,
    setPlaybackRate,
    playbackRate,
    marks,
    markLoopIndex,
  ]);

  useEffect(() => {
    lastMarkLoopIndexRef.current = markLoopIndex;
    lastMarksListRef.current = marks;
  }, [markLoopIndex, marks]);

  const playVideo = useCallback(() => {
    playerRef.current?.playVideo();
  }, []);

  const pauseVideo = useCallback(() => {
    playerRef.current?.pauseVideo();
  }, []);

  const getCurrentTime = useCallback(() => {
    return playerRef.current?.getCurrentTime() ?? 0;
  }, []);

  const seekTo = useCallback((seconds: number, allowSeekAhead: boolean) => {
    playerRef.current?.seekTo(seconds, allowSeekAhead);
  }, []);

  const setPlayerPlaybackRate = useCallback((rate: number) => {
    if (!playerRef.current) {
      return;
    }
    savedTimeRef.current = playerRef.current.getCurrentTime();
    playerRef.current.setPlaybackRate(rate);
  }, []);

  return {
    player: playerRef.current,
    playerState,
    videoId,
    setVideoId,
    duration,
    playbackRate,
    availablePlaybackRates,
    playVideo,
    pauseVideo,
    getCurrentTime,
    seekTo,
    setPlaybackRate: setPlayerPlaybackRate,
  };
}

export function YoutubePlayerContainer() {
  return (
    <div className="flex aspect-video h-full w-full items-center">
      <div id={playerId} className="h-full w-full" />
    </div>
  );
}
