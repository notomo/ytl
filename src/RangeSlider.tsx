import { type Ranger, useRanger } from "@tanstack/react-ranger";
import React from "react";
import { cn } from "./tailwind";

export function RangeSlider({
  startSeconds,
  endSeconds,
  duration,
  setStartSeconds,
  setEndSeconds,
}: {
  startSeconds: number;
  endSeconds?: number;
  duration: number;
  setStartSeconds: (s: number) => void;
  setEndSeconds: (s: number) => void;
}) {
  const rangerRef = React.useRef<HTMLDivElement>(null);

  const rangerInstance = useRanger<HTMLDivElement>({
    getRangerElement: () => rangerRef.current,
    values: [startSeconds, endSeconds ?? duration],
    min: 0,
    max: duration,
    stepSize: 1,
    onChange: (instance: Ranger<HTMLDivElement>) => {
      const [s, e] = instance.sortedValues;
      if (s !== undefined) {
        setStartSeconds(s);
      }
      if (e !== undefined) {
        setEndSeconds(e);
      }
    },
  });

  return (
    <div
      ref={rangerRef}
      className="relative h-4 bg-green-300 rounded-md select-none"
    >
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
                "absolute h-12 w-12 rounded-full bg-green-300 border top-1/2 outline-none -translate-x-1/2 -translate-y-1/2",
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
