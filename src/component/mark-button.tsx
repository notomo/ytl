import { Minus, Plus } from "lucide-react";
import React from "react";
import { iconButtonStyle } from "./button";

export const AddMarkButton = React.memo(function AddMarkButton({
  getCurrentTime,
  marksList,
  onAddMark,
}: {
  getCurrentTime: () => number;
  marksList: number[];
  onAddMark: (newMarks: number[]) => void;
}) {
  const handleClick = () => {
    const currentTime = getCurrentTime();
    if (!marksList.includes(currentTime)) {
      const newMarks = [...marksList, currentTime].sort((a, b) => a - b);
      onAddMark(newMarks);
    }
  };

  return (
    <button
      type="button"
      className={iconButtonStyle}
      onClick={handleClick}
      title="Add mark at current time"
    >
      <Plus />
    </button>
  );
});

export const DeleteMarkButton = React.memo(function DeleteMarkButton({
  getCurrentTime,
  marksList,
  onDeleteMark,
}: {
  getCurrentTime: () => number;
  marksList: number[];
  onDeleteMark: (newMarks: number[]) => void;
}) {
  const handleClick = () => {
    const currentTime = getCurrentTime();
    const previousMarks = marksList.filter((mark) => mark <= currentTime);
    if (previousMarks.length > 0) {
      const lastMark = Math.max(...previousMarks);
      const newMarks = marksList.filter((mark) => mark !== lastMark);
      onDeleteMark(newMarks);
    }
  };

  return (
    <button
      type="button"
      className={iconButtonStyle}
      onClick={handleClick}
      title="Remove previous mark"
    >
      <Minus />
    </button>
  );
});
