import React, { useCallback } from "react";
import { cn } from "~/lib/tailwind";
import { type RangeInstance, useRange } from "./range";

export const PlaybackRateSlider = React.memo(function PlaybackRateSlider({
  setPlaybackRate,
  playbackRate,
  availablePlaybackRates,
  className,
}: {
  setPlaybackRate: (rate: number) => void;
  playbackRate: number;
  availablePlaybackRates: number[];
  className?: string;
}) {
  const min = Math.min(...(availablePlaybackRates || []));
  const max = Math.max(...(availablePlaybackRates || []));

  const rangerRef = React.useRef<HTMLDivElement>(null);

  const onChange = useCallback(
    (instance: RangeInstance) => {
      const [playbackRate] = instance.sortedValues;
      setPlaybackRate(playbackRate ?? 1);
    },
    [setPlaybackRate],
  );

  const rangerInstance = useRange({
    getRangerElement: () => rangerRef.current,
    values: [playbackRate],
    min,
    max,
    stepSize: 0.25,
    ticks: availablePlaybackRates || [],
    onChange,
  });

  const handleBackgroundClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (!rangerRef.current) return;

      const rect = rangerRef.current.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const percentage = Math.max(
        0,
        Math.min(100, (clickX / rect.width) * 100),
      );
      const clickValue = min + (percentage / 100) * (max - min);

      const nearestRate = availablePlaybackRates.reduce((closest, rate) => {
        return Math.abs(rate - clickValue) < Math.abs(closest - clickValue)
          ? rate
          : closest;
      });

      setPlaybackRate(nearestRate);
    },
    [min, max, availablePlaybackRates, setPlaybackRate],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        const currentIndex = availablePlaybackRates.indexOf(playbackRate);
        if (
          currentIndex >= 0 &&
          currentIndex < availablePlaybackRates.length - 1
        ) {
          setPlaybackRate(
            availablePlaybackRates[currentIndex + 1] ?? playbackRate,
          );
        } else {
          setPlaybackRate(availablePlaybackRates[0] ?? playbackRate);
        }
      }
    },
    [availablePlaybackRates, playbackRate, setPlaybackRate],
  );

  const mainPlaybackRates = new Set(
    [
      (availablePlaybackRates || []).at(0),
      1,
      (availablePlaybackRates || []).at(-1),
    ].filter((x) => x !== undefined),
  );

  return (
    <div
      onClick={handleBackgroundClick}
      onKeyDown={handleKeyDown}
      role="slider"
      tabIndex={0}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={playbackRate}
      aria-label="Playback rate slider"
      className={cn(
        "relative w-full cursor-pointer select-none pt-2 pb-6",
        className,
      )}
    >
      <div
        ref={rangerRef}
        className="relative h-2 w-full rounded-md bg-gray-700"
      >
        {rangerInstance.getTicks().map(({ value, key, percentage }) => (
          <div
            className="absolute"
            key={key}
            style={{
              left: `${percentage}%`,
            }}
          >
            <button
              type="button"
              className="-top-0.5 -translate-x-1/2 absolute h-3 w-3 rounded-full bg-gray-600"
              onKeyDown={() => {
                setPlaybackRate(value);
              }}
              onMouseDown={(e) => {
                e.stopPropagation();
                setPlaybackRate(value);
              }}
            />
            {mainPlaybackRates.has(value) ? (
              <button
                type="button"
                className="-translate-x-1/2 absolute translate-y-2/3 cursor-pointer border-none bg-transparent text-inherit"
                onMouseDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  setPlaybackRate(value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    e.stopPropagation();
                    setPlaybackRate(value);
                  }
                }}
              >
                {value}
              </button>
            ) : null}
          </div>
        ))}
        {rangerInstance
          .handles()
          .map(
            ({
              value,
              onKeyDownHandler,
              onMouseDownHandler,
              onTouchStart,
              isActive,
            }) => (
              <button
                type="button"
                key={"s"}
                onKeyDown={onKeyDownHandler}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  onMouseDownHandler(e);
                }}
                onTouchStart={onTouchStart}
                role="slider"
                aria-valuemin={rangerInstance.options.min}
                aria-valuemax={rangerInstance.options.max}
                aria-valuenow={value}
                style={{
                  left: `${rangerInstance.getPercentageForValue(value)}%`,
                }}
                className={cn(
                  "-translate-x-1/2 -translate-y-1/2 absolute top-1/2 h-6 w-6 rounded-full border border-green-900 bg-green-700 outline-hidden",
                  {
                    "z-10": isActive,
                    "z-0": !isActive,
                  },
                )}
              />
            ),
          )}
      </div>
    </div>
  );
});
