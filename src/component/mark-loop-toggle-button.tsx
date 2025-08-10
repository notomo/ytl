import { RotateCcw } from "lucide-react";
import React from "react";
import { cn } from "~/lib/tailwind";
import { iconButtonStyle } from "./button";
import { findNearestSegment } from "./mark";

export const MarkLoopToggleButton = React.memo(function MarkLoopToggleButton({
  enabled,
  marks,
  onToggleMarkLoop,
  getCurrentTime,
}: {
  enabled: boolean;
  marks: number[];
  onToggleMarkLoop: (index: number | null) => void;
  getCurrentTime: () => number;
}) {
  const handleClick = () => {
    if (enabled) {
      onToggleMarkLoop(null);
      return;
    }

    const currentTime = getCurrentTime();
    const segmentIndex = findNearestSegment({ marks, currentTime });
    onToggleMarkLoop(segmentIndex);
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
