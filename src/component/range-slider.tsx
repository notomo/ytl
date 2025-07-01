import React, { useEffect, useState } from "react";
import { cn } from "~/lib/tailwind";
import { type RangeInstance, useRange } from "./range";
import type { YouTubePlayer } from "./youtube";

export function RangeSlider({
  startSeconds,
  endSeconds,
  duration,
  setStartSeconds,
  setEndSeconds,
  player,
  className,
}: {
  startSeconds: number;
  endSeconds?: number;
  duration: number;
  setStartSeconds: (s: number) => void;
  setEndSeconds: (s: number) => void;
  player: YouTubePlayer;
  className?: string;
}) {
  const rangerRef = React.useRef<HTMLDivElement>(null);

  const rangerInstance = useRange({
    getRangerElement: () => rangerRef.current,
    values: [startSeconds, endSeconds ?? duration],
    min: 0,
    max: duration,
    stepSize: 1,
    onChange: (instance: RangeInstance) => {
      const [s, e] = instance.sortedValues;
      if (s !== undefined) {
        setStartSeconds(s);
      }
      if (e !== undefined) {
        setEndSeconds(e);
      }
    },
  });

  const leftPercentage = rangerInstance.getPercentageForValue(startSeconds);
  const rightPercentage = rangerInstance.getPercentageForValue(
    endSeconds ?? duration,
  );

  return (
    <div
      ref={rangerRef}
      className={cn(
        "relative h-4 bg-gray-700 rounded-md select-none",
        className,
      )}
    >
      <div
        key="s"
        className="absolute h-full bg-green-700"
        style={{
          width: `${rightPercentage - leftPercentage}%`,
          left: `${leftPercentage}%`,
        }}
      />
      {rangerInstance
        .handles()
        .map(
          (
            {
              value,
              onKeyDownHandler,
              onMouseDownHandler,
              onTouchStart,
              isActive,
            },
            i,
          ) => (
            <button
              type="button"
              key={i === 0 ? "s" : "e"}
              onKeyDown={onKeyDownHandler}
              onMouseDown={onMouseDownHandler}
              onTouchStart={onTouchStart}
              role="slider"
              aria-valuemin={rangerInstance.options.min}
              aria-valuemax={rangerInstance.options.max}
              aria-valuenow={value}
              style={{
                left: `${rangerInstance.getPercentageForValue(value)}%`,
              }}
              className={cn(
                "absolute h-8 w-8 rounded-full bg-green-700 border border-green-900 top-1/2 outline-hidden -translate-x-1/2 -translate-y-1/2",
                {
                  "z-10": isActive,
                  "z-0": !isActive,
                },
              )}
            />
          ),
        )}
      <CurrentTimeIndicator player={player} duration={duration} />
    </div>
  );
}

export function CurrentTimeIndicator({
  duration,
  player,
}: {
  duration: number;
  player: YouTubePlayer;
}) {
  const [currentTime, setCurrentTIme] = useState(player.getCurrentTime());

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTIme(player.getCurrentTime());
      return () => {
        clearInterval(timerId);
      };
    }, 1000);
  }, [player]);

  const percent = (currentTime / duration) * 100;

  return (
    <div
      className="absolute w-1 h-full bg-green-300"
      style={{
        left: `${percent}%`,
      }}
    />
  );
}
