import { ChevronFirst, ChevronLast } from "lucide-react";
import React, { useCallback } from "react";
import { iconButtonStyle } from "./button";
import { findNextMark, findPreviousMark } from "./mark";

export const SeekToNextButton = React.memo(function SeekToNextButton({
  pauseVideo,
  seekTo,
  getCurrentTime,
  marks,
  fallbackSeconds,
}: {
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  getCurrentTime: () => number;
  marks: number[];
  fallbackSeconds: number;
}) {
  const onClick = useCallback(() => {
    pauseVideo();
    const currentTime = getCurrentTime();
    const targetSeconds = findNextMark({ marks, currentTime, fallbackSeconds });
    seekTo(targetSeconds, true);
  }, [pauseVideo, seekTo, getCurrentTime, marks, fallbackSeconds]);

  return (
    <button type="button" className={iconButtonStyle} onClick={onClick}>
      <ChevronLast />
    </button>
  );
});

export const SeekToPreviousButton = React.memo(function SeekToPreviousButton({
  pauseVideo,
  seekTo,
  getCurrentTime,
  marks,
  fallbackSeconds,
}: {
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  getCurrentTime: () => number;
  marks: number[];
  fallbackSeconds: number;
}) {
  const onClick = useCallback(() => {
    pauseVideo();
    const currentTime = getCurrentTime();
    const targetSeconds = findPreviousMark({
      marks,
      currentTime,
      fallbackSeconds,
    });
    seekTo(targetSeconds, true);
  }, [pauseVideo, seekTo, getCurrentTime, marks, fallbackSeconds]);

  return (
    <button type="button" className={iconButtonStyle} onClick={onClick}>
      <ChevronFirst />
    </button>
  );
});
