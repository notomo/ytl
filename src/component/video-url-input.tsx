import { Check } from "lucide-react";
import { useRef, useState } from "react";

export function VideoUrlInput({
  videoId,
  setVideoId,
}: {
  videoId: string;
  setVideoId: (x: string) => void;
}) {
  const [editting, setEditting] = useState(false);
  return editting ? (
    <EdittingVideoUrlInput
      videoId={videoId}
      setVideoId={setVideoId}
      setEditting={setEditting}
    />
  ) : (
    <button
      type="button"
      className="border border-white p-2"
      onClick={() => {
        setEditting(true);
      }}
    >
      {videoId}
    </button>
  );
}

function EdittingVideoUrlInput({
  videoId,
  setVideoId,
  setEditting,
}: {
  videoId: string;
  setVideoId: (x: string) => void;
  setEditting: (x: boolean) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  return (
    <div className="flex items-center gap-2">
      <input
        ref={input}
        className="border border-gray-500 p-2"
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
        className="rounded-full"
        onClick={() => {
          const current = input.current;
          if (current === null) {
            return;
          }

          const url = new URL(current.value);
          const v = url.searchParams.get("v");

          setEditting(false);
          setVideoId(v ?? videoId);
        }}
      >
        <Check />
      </button>
    </div>
  );
}
