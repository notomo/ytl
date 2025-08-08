import React from "react";
import { iconButtonStyle } from "~/component/button";

export const SeekToPositionButton = React.memo(function SeekToPositionButton({
  pauseVideo,
  seekTo,
  targetSeconds,
  children,
}: {
  children: React.ReactNode;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  targetSeconds: number;
}) {
  return (
    <button
      type="button"
      className={iconButtonStyle}
      onClick={() => {
        pauseVideo();
        seekTo(targetSeconds, true);
      }}
    >
      {children}
    </button>
  );
});
