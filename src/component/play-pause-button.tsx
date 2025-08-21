import { Pause, Play } from "lucide-react";
import React from "react";
import { iconButtonStyle } from "./button";

export const PlayPauseButton = React.memo(function PlayPauseButton({
  playVideo,
  pauseVideo,
  isPaused,
}: {
  playVideo: () => void;
  pauseVideo: () => void;
  isPaused: boolean;
}) {
  return (
    <button
      type="button"
      className={iconButtonStyle}
      onClick={() => {
        if (!isPaused) {
          pauseVideo();
        } else {
          playVideo();
        }
      }}
    >
      {!isPaused ? <Pause /> : <Play />}
    </button>
  );
});
