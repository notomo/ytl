import * as Popover from "@radix-ui/react-popover";
import { ClipboardPaste } from "lucide-react";
import { useState } from "react";

export function VideoUrlInput({
  videoId,
  setVideoId,
}: {
  videoId: string;
  setVideoId: (x: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button type="button" className="border border-white p-2">
          {videoId}
        </button>
      </Popover.Trigger>

      <Popover.Anchor />
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
      className="rounded-md p-2 flex items-center gap-2 bg-background border border-gray-500"
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
