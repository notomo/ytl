import { Pause, Play } from "lucide-react";
import { type PlayerState, PlayerStates, type YouTubePlayer } from "./youtube";

export function PlayPauseButton({
  player,
  playerState,
}: {
  player: YouTubePlayer | null;
  playerState: PlayerState;
}) {
  const isPlaying = playerState === PlayerStates.PLAYING;

  return (
    <button
      type="button"
      onClick={() => {
        if (!player) {
          return;
        }

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
