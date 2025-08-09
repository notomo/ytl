import { RotateCcw } from "lucide-react";
import React from "react";
import { cn } from "~/lib/tailwind";
import { iconButtonStyle } from "./button";
import { findMarkNearestBefore } from "./mark";

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
  const enabled = markLoopIndex !== null;

  const handleClick = () => {
    if (enabled) {
      onToggleMarkLoop(null);
      return;
    }

    const currentTime = getCurrentTime();
    const nearestIndex = findMarkNearestBefore({ marks, currentTime });
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
