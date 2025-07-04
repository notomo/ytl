import React, { useCallback, useMemo } from "react";
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
  const { min, max } = useMemo(
    () => ({
      min: Math.min(...(availablePlaybackRates || [])),
      max: Math.max(...(availablePlaybackRates || [])),
    }),
    [availablePlaybackRates],
  );

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

  const mainPlaybackRates = useMemo(
    () =>
      new Set(
        [
          (availablePlaybackRates || []).at(0),
          1,
          (availablePlaybackRates || []).at(-1),
        ].filter((x) => x !== undefined),
      ),
    [availablePlaybackRates],
  );

  return (
    <div
      ref={rangerRef}
      className={cn(
        "-translate-y-1/2 relative h-2 w-80 select-none rounded-md bg-gray-700",
        className,
      )}
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
            onMouseDown={() => {
              setPlaybackRate(value);
            }}
          />
          {mainPlaybackRates.has(value) ? (
            <div className="-translate-x-1/2 absolute translate-y-2/3">
              {value}
            </div>
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
  );
});
