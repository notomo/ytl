import * as Popover from "@radix-ui/react-popover";
import { ClipboardPaste } from "lucide-react";
import React, { useState } from "react";
import { cn } from "../lib/tailwind";
import { buttonStyle } from "./button";

export const VideoUrlInput = React.memo(function VideoUrlInput({
  videoId,
  setVideoId,
}: {
  videoId: string;
  setVideoId: (x: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="w-fit">
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <button type="button" className={buttonStyle}>
            {videoId}
          </button>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content side="right">
            <EdittingVideoUrlInput
              videoId={videoId}
              setVideoId={(x) => {
                setOpen(false);
                setVideoId(x);
              }}
            />
            <Popover.Close />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
});

function EdittingVideoUrlInput({
  videoId,
  setVideoId,
}: {
  videoId: string;
  setVideoId: (x: string) => void;
}) {
  return (
    <button
      type="button"
      className={cn(buttonStyle, "flex items-center gap-2")}
      onClick={async () => {
        const value = await navigator.clipboard.readText();
        const url = new URL(value);
        setVideoId(url.searchParams.get("v") ?? videoId);
      }}
    >
      <ClipboardPaste />
      Paste URL
    </button>
  );
}
