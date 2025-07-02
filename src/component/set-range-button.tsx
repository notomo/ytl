import React from "react";
import { iconButtonStyle } from "~/component/button";

export const SetRangeButton = React.memo(function SetRangeButton({
  children,
  getCurrentTime,
  setSeconds,
  title,
}: React.PropsWithChildren<{
  getCurrentTime: () => number;
  setSeconds: (x: number) => void;
  title: string;
}>) {
  return (
    <button
      type="button"
      className={iconButtonStyle}
      title={title}
      onClick={() => {
        const currentTime = getCurrentTime();
        setSeconds(Math.floor(currentTime));
      }}
    >
      {children}
    </button>
  );
});
