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
  marks,
  markLoopIndex,
  className,
  isCutStart = false,
  isCutEnd = false,
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
  className?: string;
  isCutStart?: boolean;
  isCutEnd?: boolean;
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

  const effectiveMin = isCutStart ? startSeconds : 0;
  const effectiveMax = isCutEnd ? (endSeconds ?? duration) : duration;

  const rangerInstance = useRange({
    getRangerElement: () => ref.current,
    values: [startSeconds, endSeconds ?? duration],
    min: effectiveMin,
    max: effectiveMax,
    stepSize: 1,
    onChange,
  });

  const leftPercentage = rangerInstance.getPercentageForValue(startSeconds);

  const rightPercentage = rangerInstance.getPercentageForValue(
    endSeconds ?? duration,
  );

  const getMarkLoopRange = () => {
    if (markLoopIndex === null) {
      return null;
    }

    const sortedMarks = marks.toSorted((a, b) => a - b);

    if (markLoopIndex < 0 || markLoopIndex > sortedMarks.length) {
      return null;
    }

    let loopStartTime: number;
    let loopEndTime: number;

    if (markLoopIndex === 0) {
      loopStartTime = startSeconds;
      loopEndTime =
        sortedMarks.length > 0
          ? (sortedMarks[0] ?? endSeconds ?? duration)
          : (endSeconds ?? duration);
    } else if (markLoopIndex === sortedMarks.length) {
      loopStartTime = sortedMarks[markLoopIndex - 1] ?? startSeconds;
      loopEndTime = endSeconds ?? duration;
    } else {
      loopStartTime = sortedMarks[markLoopIndex - 1] ?? startSeconds;
      loopEndTime = sortedMarks[markLoopIndex] ?? endSeconds ?? duration;
    }

    return {
      start: loopStartTime,
      end: loopEndTime,
      startPercentage: rangerInstance.getPercentageForValue(loopStartTime),
      endPercentage: rangerInstance.getPercentageForValue(loopEndTime),
    };
  };

  const markLoopRange = getMarkLoopRange();

  const handleSliderClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "BUTTON") return;

      const rect = e.currentTarget.getBoundingClientRect();
      const percentage = ((e.clientX - rect.left) / rect.width) * 100;
      const seconds =
        (percentage / 100) * (effectiveMax - effectiveMin) + effectiveMin;
      const clampedSeconds = Math.max(
        effectiveMin,
        Math.min(effectiveMax, seconds),
      );

      seekTo(clampedSeconds, true);
    },
    [effectiveMin, effectiveMax, seekTo],
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
      {markLoopRange && (
        <div
          className="absolute h-full bg-purple-600"
          style={{
            width: `${markLoopRange.endPercentage - markLoopRange.startPercentage}%`,
            left: `${markLoopRange.startPercentage}%`,
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
        duration={duration}
        effectiveMin={effectiveMin}
        effectiveMax={effectiveMax}
      />
      {marks
        .filter((mark) => mark >= effectiveMin && mark <= effectiveMax)
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
  duration,
  getCurrentTime,
  effectiveMin = 0,
  effectiveMax,
}: {
  duration: number;
  getCurrentTime: () => number;
  effectiveMin?: number;
  effectiveMax?: number;
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

  const actualEffectiveMax = effectiveMax ?? duration;
  const isInRange =
    currentTime >= effectiveMin && currentTime <= actualEffectiveMax;

  if (!isInRange) {
    return null;
  }

  const percent =
    ((currentTime - effectiveMin) / (actualEffectiveMax - effectiveMin)) * 100;

  return (
    <div
      className="-translate-x-1/2 absolute h-full w-1 bg-green-300"
      style={{
        left: `${percent}%`,
      }}
    />
  );
});
