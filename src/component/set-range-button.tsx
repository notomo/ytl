import React from "react";
import { iconButtonStyle } from "~/component/button";
import type { YouTubePlayer } from "./youtube";

export const SetRangeButton = React.memo(function SetRangeButton({
  children,
  player,
  setSeconds,
  title,
}: React.PropsWithChildren<{
  player: YouTubePlayer;
  setSeconds: (x: number) => void;
  title: string;
}>) {
  return (
    <button
      type="button"
      className={iconButtonStyle}
      title={title}
      onClick={() => {
        const currentTime = player.getCurrentTime();
        setSeconds(Math.floor(currentTime));
      }}
    >
      {children}
    </button>
  );
});
