import { RotateCcw } from "lucide-react";
import React from "react";
import { iconButtonStyle } from "./button";

export const MarkLoopToggleButton = React.memo(function MarkLoopToggleButton({
  markLoopIndex,
  marksList,
  onToggleMarkLoop,
  getCurrentTime,
}: {
  markLoopIndex?: number | null;
  marksList: number[];
  onToggleMarkLoop: (index: number | null) => void;
  getCurrentTime: () => number;
}) {
  const isMarkLoopEnabled =
    markLoopIndex !== null && markLoopIndex !== undefined;

  const findNearestPreviousMark = () => {
    const currentTime = getCurrentTime();
    const sortedMarks = [...marksList].sort((a, b) => a - b);

    const marksBeforeCurrent = sortedMarks.filter(
      (mark) => mark <= currentTime,
    );
    if (marksBeforeCurrent.length === 0) {
      return 0;
    }

    const nearestMark = marksBeforeCurrent[marksBeforeCurrent.length - 1];
    if (nearestMark === undefined) {
      return 0;
    }
    return marksList.indexOf(nearestMark);
  };

  const handleClick = () => {
    if (isMarkLoopEnabled) {
      onToggleMarkLoop(null);
    } else {
      const nearestIndex = findNearestPreviousMark();
      onToggleMarkLoop(nearestIndex);
    }
  };

  const isDisabled = marksList.length === 0;

  return (
    <button
      type="button"
      className={`${iconButtonStyle} ${isMarkLoopEnabled ? "bg-purple-700 text-white" : ""}`}
      onClick={handleClick}
      disabled={isDisabled}
      title={isMarkLoopEnabled ? "Disable mark loop" : "Enable mark loop"}
    >
      <RotateCcw />
    </button>
  );
});
