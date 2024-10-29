import * as Popover from "@radix-ui/react-popover";
import { ClipboardPaste } from "lucide-react";
import { useState } from "react";
import { buttonStyle } from "~/component/button";
import { cn } from "~/lib/tailwind";

export function VideoUrlInput({
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
        <Popover.Anchor />

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
}

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
