import React, { useCallback, useEffect, useState } from "react";
import { cn } from "~/lib/tailwind";
import { getLoopRange } from "./mark";
import { type RangeInstance, useRange } from "./range";

export const RangeSlider = React.memo(function RangeSlider({
  startSeconds,
  endSeconds,
  duration,
  setStartSeconds,
  setEndSeconds,
  getCurrentTime,
  seekTo,
  marks,
  markLoopIndex,
  isCutStart,
  isCutEnd,
  className,
}: {
  startSeconds: number;
  endSeconds?: number;
  duration: number;
  setStartSeconds: (s: number) => void;
  setEndSeconds: (s: number) => void;
  getCurrentTime: () => number;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  marks: number[];
  markLoopIndex: number | null;
  isCutStart: boolean;
  isCutEnd: boolean;
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

  const min = isCutStart ? startSeconds : 0;
  const max = isCutEnd ? (endSeconds ?? duration) : duration;

  const rangerInstance = useRange({
    getRangerElement: () => ref.current,
    values: [startSeconds, endSeconds ?? duration],
    min,
    max,
    stepSize: 1,
    onChange,
  });

  const leftPercentage = rangerInstance.getPercentageForValue(startSeconds);
  const rightPercentage = rangerInstance.getPercentageForValue(
    endSeconds ?? duration,
  );

  const loopRange = getLoopRange({
    marks,
    markLoopIndex,
    startSeconds,
    endSeconds: endSeconds ?? duration,
  });
  const loopPercentage = loopRange
    ? {
        start: rangerInstance.getPercentageForValue(loopRange.start),
        end: rangerInstance.getPercentageForValue(loopRange.end),
      }
    : null;

  const handleSliderClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "BUTTON") {
        return;
      }

      const rect = e.currentTarget.getBoundingClientRect();
      const percentage = ((e.clientX - rect.left) / rect.width) * 100;
      const seconds = (percentage / 100) * (max - min) + min;
      const clampedSeconds = Math.max(min, Math.min(max, seconds));

      seekTo(clampedSeconds, true);
    },
    [min, max, seekTo],
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
      {loopPercentage && (
        <div
          className="absolute h-full bg-purple-600"
          style={{
            width: `${loopPercentage.end - loopPercentage.start}%`,
            left: `${loopPercentage.start}%`,
          }}
        />
      )}
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
        min={min}
        max={max}
      />
      {marks
        .filter((mark) => min <= mark && mark <= max)
        .map((mark) => {
          return (
            <div
              key={mark}
              className={
                "-translate-x-1/2 -translate-y-1/2 absolute top-1/2 h-2/3 w-1 rounded-full bg-red-300"
              }
              style={{
                left: `${rangerInstance.getPercentageForValue(mark)}%`,
              }}
            />
          );
        })}
    </div>
  );
});

export const CurrentTimeIndicator = React.memo(function CurrentTimeIndicator({
  getCurrentTime,
  min,
  max,
}: {
  getCurrentTime: () => number;
  min: number;
  max: number;
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

  const isInRange = min <= currentTime && currentTime <= max;
  if (!isInRange) {
    return null;
  }

  const percent = ((currentTime - min) / (max - min)) * 100;
  return (
    <div
      className="-translate-x-1/2 absolute h-full w-1 bg-green-300"
      style={{
        left: `${percent}%`,
      }}
    />
  );
});
