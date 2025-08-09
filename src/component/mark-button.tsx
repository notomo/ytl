import { Minus, Plus } from "lucide-react";
import React from "react";
import { iconButtonStyle } from "./button";

export const AddMarkButton = React.memo(function AddMarkButton({
  getCurrentTime,
  marks,
  onAddMark,
}: {
  getCurrentTime: () => number;
  marks: number[];
  onAddMark: (newMarks: number[]) => void;
}) {
  const handleClick = () => {
    const currentTime = getCurrentTime();
    if (!marks.includes(currentTime)) {
      const newMarks = [...marks, currentTime].sort((a, b) => a - b);
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
  marks,
  onDeleteMark,
}: {
  getCurrentTime: () => number;
  marks: number[];
  onDeleteMark: (newMarks: number[]) => void;
}) {
  const handleClick = () => {
    const currentTime = getCurrentTime();
    const previousMarks = marks.filter((mark) => mark <= currentTime);

    if (previousMarks.length > 0) {
      const lastMark = Math.max(...previousMarks);
      const newMarks = marks.filter((mark) => mark !== lastMark);
      onDeleteMark(newMarks);
      return;
    }

    const nextMarks = marks.filter((mark) => mark > currentTime);
    if (nextMarks.length > 0) {
      const firstMark = Math.min(...nextMarks);
      const newMarks = marks.filter((mark) => mark !== firstMark);
      onDeleteMark(newMarks);
      return;
    }
  };

  return (
    <button
      type="button"
      className={iconButtonStyle}
      onClick={handleClick}
      title="Remove nearest mark"
    >
      <Minus />
    </button>
  );
});
