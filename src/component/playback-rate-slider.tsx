import { type Ranger, useRanger } from "@tanstack/react-ranger";
import React from "react";
import { cn } from "~/lib/tailwind";
import type { YouTubePlayer } from "./youtube";

export function PlaybackRateSlider({
  player,
  playbackRate,
  availablePlaybackRates,
  className,
}: {
  player: YouTubePlayer;
  playbackRate: number;
  availablePlaybackRates: number[];
  className?: string;
}) {
  const min = Math.min(...availablePlaybackRates);
  const max = Math.max(...availablePlaybackRates);

  const rangerRef = React.useRef<HTMLDivElement>(null);

  const rangerInstance = useRanger<HTMLDivElement>({
    getRangerElement: () => rangerRef.current,
    values: [playbackRate],
    min,
    max,
    stepSize: 0.25,
    ticks: availablePlaybackRates,
    onChange: (instance: Ranger<HTMLDivElement>) => {
      const [playbackRate] = instance.sortedValues;
      player.setPlaybackRate(playbackRate ?? 1);
    },
  });

  return (
    <div
      ref={rangerRef}
      className={cn(
        "relative h-2 bg-gray-700 rounded-md select-none w-80",
        className,
      )}
    >
      {rangerInstance.getTicks().map(({ value, key, percentage }) => (
        <div
          key={key}
          className="absolute h-full top-3 -translate-x-1/2"
          style={{
            left: `${percentage}%`,
          }}
        >
          {value}
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
                "absolute h-6 w-6 rounded-full bg-green-700 border border-green-900 top-1/2 outline-none -translate-x-1/2 -translate-y-1/2",
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
}
