import * as Popover from "@radix-ui/react-popover";
import { Check } from "lucide-react";
import { useRef, useState } from "react";

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
  const input = useRef<HTMLInputElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  return (
    <div className="flex items-center rounded-md border border-gray-400">
      <input
        ref={input}
        className="p-2 text-center outline-none"
        type="url"
        defaultValue={`https://www.youtube.com/watch?v=${videoId}`}
        onKeyDown={(e) => {
          if (e.key !== "Enter") {
            return;
          }
          e.preventDefault();
          button.current?.click();
        }}
      />
      <button
        ref={button}
        type="button"
        className="rounded-md bg-green-400 p-2"
        onClick={() => {
          const current = input.current;
          if (current === null) {
            return;
          }

          const url = new URL(current.value);
          const v = url.searchParams.get("v");

          setVideoId(v ?? videoId);
        }}
      >
        <Check />
      </button>
    </div>
  );
}
