import { ChevronFirst, ChevronLast } from "lucide-react";
import React, { useCallback } from "react";
import { iconButtonStyle } from "~/component/button";

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
    const nextMarks = marks.filter((mark) => mark > currentTime);
    const targetSeconds =
      nextMarks.length > 0 ? Math.min(...nextMarks) : fallbackSeconds;
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
    const previousMarks = marks.filter((mark) => mark < currentTime);
    const targetSeconds =
      previousMarks.length > 0 ? Math.max(...previousMarks) : fallbackSeconds;
    seekTo(targetSeconds, true);
  }, [pauseVideo, seekTo, getCurrentTime, marks, fallbackSeconds]);

  return (
    <button type="button" className={iconButtonStyle} onClick={onClick}>
      <ChevronFirst />
    </button>
  );
});
