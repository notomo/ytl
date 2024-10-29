import { Pause, Play } from "lucide-react";
import { iconButtonStyle } from "~/component/button";
import { type PlayerState, PlayerStates, type YouTubePlayer } from "./youtube";

export function PlayPauseButton({
  player,
  playerState,
}: {
  player: YouTubePlayer;
  playerState: PlayerState;
}) {
  const isPlaying = playerState === PlayerStates.PLAYING;

  return (
    <button
      type="button"
      className={iconButtonStyle}
      onClick={() => {
        if (isPlaying) {
          player.pauseVideo();
          return;
        }
        player.playVideo();
      }}
    >
      {isPlaying ? <Pause /> : <Play />}
    </button>
  );
}
