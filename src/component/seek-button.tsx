import React from "react";
import { iconButtonStyle } from "~/component/button";

export const SeekButton = React.memo(function SeekButton({
  pauseVideo,
  getCurrentTime,
  seekTo,
  seekOffset,
  children,
}: React.PropsWithChildren<{
  pauseVideo: () => void;
  getCurrentTime: () => number;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  seekOffset: number;
}>) {
  return (
    <button
      type="button"
      className={iconButtonStyle}
      onClick={() => {
        pauseVideo();

        const currentTime = getCurrentTime();
        seekTo(currentTime + seekOffset, true);
      }}
    >
      {children}
    </button>
  );
});
