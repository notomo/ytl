import { RotateCcw } from "lucide-react";
import React from "react";
import { cn } from "~/lib/tailwind";
import { iconButtonStyle } from "./button";

export const MarkLoopToggleButton = React.memo(function MarkLoopToggleButton({
  markLoopIndex,
  marks,
  onToggleMarkLoop,
  getCurrentTime,
}: {
  markLoopIndex: number | null;
  marks: number[];
  onToggleMarkLoop: (index: number | null) => void;
  getCurrentTime: () => number;
}) {
  const findNearestBefore = () => {
    const currentTime = getCurrentTime();

    const marksBefore = marks
      .toSorted((a, b) => a - b)
      .filter((mark) => mark <= currentTime);
    if (marksBefore.length === 0) {
      return null;
    }

    const nearest = marksBefore[marksBefore.length - 1];
    if (nearest === undefined) {
      return null;
    }

    return marks.indexOf(nearest);
  };

  const enabled = markLoopIndex !== null;

  const handleClick = () => {
    if (enabled) {
      onToggleMarkLoop(null);
      return;
    }

    const nearestIndex = findNearestBefore();
    onToggleMarkLoop(nearestIndex);
  };

  return (
    <button
      type="button"
      className={cn(iconButtonStyle, {
        "bg-purple-700 text-white": enabled,
      })}
      onClick={handleClick}
      disabled={marks.length === 0}
      title={enabled ? "Disable mark loop" : "Enable mark loop"}
    >
      <RotateCcw />
    </button>
  );
});
