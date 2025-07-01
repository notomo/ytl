import React from "react";
import { iconButtonStyle } from "~/component/button";
import type { YouTubePlayer } from "./youtube";

export const SeekButton = React.memo(function SeekButton({
  player,
  seekOffset,
  children,
}: React.PropsWithChildren<{
  player: YouTubePlayer;
  seekOffset: number;
}>) {
  return (
    <button
      type="button"
      className={iconButtonStyle}
      onClick={() => {
        player.pauseVideo();

        const currentTime = player.getCurrentTime();
        player.seekTo(currentTime + seekOffset, true);
      }}
    >
      {children}
    </button>
  );
});
