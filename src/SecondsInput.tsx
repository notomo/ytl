import { Check } from "lucide-react";
import { useRef, useState } from "react";
import { getNumber } from "./parse";

export function SecondsInput({
  defaultValue,
  min,
  max,
  setSeconds,
}: {
  defaultValue: number;
  min: number;
  max: number;
  setSeconds: (x: number) => void;
}) {
  const [editting, setEditting] = useState(false);
  return editting ? (
    <EdittingSecondsInput
      defaultValue={defaultValue}
      min={min}
      max={max}
      setSeconds={setSeconds}
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
      {defaultValue}
    </button>
  );
}

function EdittingSecondsInput({
  defaultValue,
  min,
  max,
  setSeconds,
  setEditting,
}: {
  defaultValue: number;
  min: number;
  max: number;
  setSeconds: (x: number) => void;
  setEditting: (x: boolean) => void;
}) {
  const input = useRef<HTMLInputElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  return (
    <div className="flex items-center gap-2 p-2">
      <input
        ref={input}
        className="border border-gray-500 text-center"
        type="number"
        defaultValue={defaultValue}
        min={min}
        max={max}
        inputMode="numeric"
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
        className="bg-green-50 rounded-full"
        onClick={() => {
          const current = input.current;
          if (current === null) {
            return;
          }
          setEditting(false);
          setSeconds(getNumber(current.value) ?? 0);
        }}
      >
        <Check />
      </button>
    </div>
  );
}
