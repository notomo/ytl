import React, { useCallback, useEffect, useState } from "react";
import { cn } from "~/lib/tailwind";
import { type RangeInstance, useRange } from "./range";

export const RangeSlider = React.memo(function RangeSlider({
  startSeconds,
  endSeconds,
  duration,
  setStartSeconds,
  setEndSeconds,
  getCurrentTime,
  seekTo,
  marks = [],
  className,
}: {
  startSeconds: number;
  endSeconds?: number;
  duration: number;
  setStartSeconds: (s: number) => void;
  setEndSeconds: (s: number) => void;
  getCurrentTime: () => number;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  marks?: number[];
  className?: string;
}) {
  const ref = React.useRef<HTMLDivElement>(null);

  const onChange = useCallback(
    (instance: RangeInstance) => {
      const [s, e] = instance.sortedValues;
      if (s !== undefined) {
        setStartSeconds(s);
      }
      if (e !== undefined) {
        setEndSeconds(e);
      }
    },
    [setStartSeconds, setEndSeconds],
  );

  const rangerInstance = useRange({
    getRangerElement: () => ref.current,
    values: [startSeconds, endSeconds ?? duration],
    min: 0,
    max: duration,
    stepSize: 1,
    onChange,
  });

  const leftPercentage = rangerInstance.getPercentageForValue(startSeconds);

  const rightPercentage = rangerInstance.getPercentageForValue(
    endSeconds ?? duration,
  );

  const handleSliderClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "BUTTON") return;

      const rect = e.currentTarget.getBoundingClientRect();
      const percentage = ((e.clientX - rect.left) / rect.width) * 100;
      const seconds = (percentage / 100) * duration;
      const clampedSeconds = Math.max(0, Math.min(duration, seconds));

      seekTo(clampedSeconds, true);
    },
    [duration, seekTo],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const currentTime = getCurrentTime();
        seekTo(currentTime, true);
      }
    },
    [getCurrentTime, seekTo],
  );

  return (
    // biome-ignore lint/a11y/useSemanticElements: TODO
    <div
      ref={ref}
      onClick={handleSliderClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      className={cn(
        "relative h-4 cursor-pointer select-none rounded-md bg-gray-700",
        className,
      )}
    >
      <div
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
                "-translate-x-1/2 -translate-y-1/2 absolute top-1/2 h-8 w-8 rounded-full border border-green-900 bg-green-700 outline-hidden",
                {
                  "z-10": isActive,
                  "z-0": !isActive,
                },
              )}
            />
          ),
        )}
      <CurrentTimeIndicator
        getCurrentTime={getCurrentTime}
        duration={duration}
      />
      {marks.map((mark) => (
        <div
          key={mark}
          className="-translate-y-1/2 absolute top-1/2 h-1/2 w-1 bg-red-500"
          style={{
            left: `${rangerInstance.getPercentageForValue(mark)}%`,
          }}
        />
      ))}
    </div>
  );
});

export const CurrentTimeIndicator = React.memo(function CurrentTimeIndicator({
  duration,
  getCurrentTime,
}: {
  duration: number;
  getCurrentTime: () => number;
}) {
  const [currentTime, setCurrentTime] = useState(() => getCurrentTime());

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [getCurrentTime]);

  const percent = (currentTime / duration) * 100;

  return (
    <div
      className="absolute h-full w-1 bg-green-300"
      style={{
        left: `${percent}%`,
      }}
    />
  );
});
