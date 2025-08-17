import * as Popover from "@radix-ui/react-popover";
import { Scissors, X } from "lucide-react";
import React, { useState } from "react";
import { cn } from "../lib/tailwind";
import { buttonStyle } from "./button";

export const TimeView = React.memo(function TimeView({
  seconds,
  onToggleCut,
  isCut,
  cutType,
}: {
  seconds: number;
  onToggleCut: () => void;
  isCut: boolean;
  cutType: "start" | "end";
}) {
  const [open, setOpen] = useState(false);
  const hours = Math.floor(seconds / (60 * 60));
  const minutes = Math.floor((seconds - hours * 60 * 60) / 60);
  const restSeconds = seconds - minutes * 60 - hours * 60 * 60;
  const time = `${hours > 0 ? `${hours}:` : ""}${minutes.toString().padStart(2, "0")}:${restSeconds.toString().padStart(2, "0")}`;

  return (
    <div className="w-fit">
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Anchor />

        <Popover.Trigger asChild>
          <button
            type="button"
            className="cursor-pointer rounded px-1 underline underline-offset-8 hover:bg-gray-700"
          >
            {time}
          </button>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content side="right">
            <button
              type="button"
              className={cn(buttonStyle, "flex items-center gap-2")}
              onClick={() => {
                onToggleCut();
                setOpen(false);
              }}
            >
              {isCut ? <X size={16} /> : <Scissors size={16} />}
              {isCut ? `Show ${cutType} outside` : `Cut ${cutType} outside`}
            </button>
            <Popover.Close />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
});
