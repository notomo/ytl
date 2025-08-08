import React from "react";
import { iconButtonStyle } from "~/component/button";

export const SeekToPositionButton = React.memo(function SeekToPositionButton({
  pauseVideo,
  seekTo,
  target,
  children,
}: {
  children: React.ReactNode;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  target: number | (() => number);
}) {
  return (
    <button
      type="button"
      className={iconButtonStyle}
      onClick={() => {
        pauseVideo();
        const targetSeconds = typeof target === "function" ? target() : target;
        seekTo(targetSeconds, true);
      }}
    >
      {children}
    </button>
  );
});
