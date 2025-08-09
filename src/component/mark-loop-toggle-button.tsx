import { RotateCcw } from "lucide-react";
import React from "react";
import { iconButtonStyle } from "./button";

export const MarkLoopToggleButton = React.memo(function MarkLoopToggleButton({
  markLoopIndex,
  marksList,
  onToggleMarkLoop,
}: {
  markLoopIndex?: number | null;
  marksList: number[];
  onToggleMarkLoop: (index: number | null) => void;
}) {
  const isMarkLoopEnabled =
    markLoopIndex !== null && markLoopIndex !== undefined;

  const handleClick = () => {
    if (isMarkLoopEnabled) {
      onToggleMarkLoop(null);
    } else {
      onToggleMarkLoop(0);
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
