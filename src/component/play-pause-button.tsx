import { Pause, Play } from "lucide-react";
import React, { useCallback, useMemo } from "react";
import { iconButtonStyle } from "~/component/button";

export const PlayPauseButton = React.memo(function PlayPauseButton({
  playVideo,
  pauseVideo,
  isPaused,
}: {
  playVideo: () => void;
  pauseVideo: () => void;
  isPaused: boolean;
}) {
  const memoizedPauseIcon = useMemo(() => <Pause />, []);
  const memoizedPlayIcon = useMemo(() => <Play />, []);

  const handleClick = useCallback(() => {
    if (!isPaused) {
      pauseVideo();
    } else {
      playVideo();
    }
  }, [isPaused, pauseVideo, playVideo]);

  return (
    <button type="button" className={iconButtonStyle} onClick={handleClick}>
      {!isPaused ? memoizedPauseIcon : memoizedPlayIcon}
    </button>
  );
});

PlayPauseButton.whyDidYouRender = true;
