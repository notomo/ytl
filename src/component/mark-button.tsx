import { Minus, Plus } from "lucide-react";
import React from "react";
import { iconButtonStyle } from "./button";
import { addedMarks, deletedMarks } from "./mark";

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
    const { newMarks, isAdded } = addedMarks({ marks, currentTime });
    if (isAdded) {
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
    const { newMarks, isDeleted } = deletedMarks({ marks, currentTime });
    if (isDeleted) {
      onDeleteMark(newMarks);
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
