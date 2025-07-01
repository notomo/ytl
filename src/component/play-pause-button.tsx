import { Pause, Play } from "lucide-react";
import React, { useCallback, useMemo } from "react";
import { iconButtonStyle } from "~/component/button";
import { type PlayerState, PlayerStates, type YouTubePlayer } from "./youtube";

export const PlayPauseButton = React.memo(function PlayPauseButton({
  player,
  playerState,
}: {
  player: YouTubePlayer;
  playerState: PlayerState;
}) {
  const isPlaying = useMemo(
    () => playerState === PlayerStates.PLAYING,
    [playerState],
  );

  const handleClick = useCallback(() => {
    if (isPlaying) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  }, [isPlaying, player]);

  return (
    <button type="button" className={iconButtonStyle} onClick={handleClick}>
      {isPlaying ? <Pause /> : <Play />}
    </button>
  );
});
