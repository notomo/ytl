import { Pause, Play } from "lucide-react";
import React, { useCallback, useMemo } from "react";
import { iconButtonStyle } from "~/component/button";
import { type PlayerState, PlayerStates } from "./youtube";

export const PlayPauseButton = React.memo(function PlayPauseButton({
  playVideo,
  pauseVideo,
  playerState,
}: {
  playVideo: () => void;
  pauseVideo: () => void;
  playerState: PlayerState;
}) {
  const isPlaying = useMemo(
    () => playerState === PlayerStates.PLAYING,
    [playerState],
  );

  const memoizedPauseIcon = useMemo(() => <Pause />, []);
  const memoizedPlayIcon = useMemo(() => <Play />, []);

  const handleClick = useCallback(() => {
    if (isPlaying) {
      pauseVideo();
    } else {
      playVideo();
    }
  }, [isPlaying, pauseVideo, playVideo]);

  return (
    <button type="button" className={iconButtonStyle} onClick={handleClick}>
      {isPlaying ? memoizedPauseIcon : memoizedPlayIcon}
    </button>
  );
});
