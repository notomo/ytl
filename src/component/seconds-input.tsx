import * as Popover from "@radix-ui/react-popover";
import { Check } from "lucide-react";
import { useRef, useState } from "react";
import { getNumber } from "~/lib/parse";

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
  const [open, setOpen] = useState(false);
  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button type="button" className="border border-white p-2">
          {defaultValue}
        </button>
      </Popover.Trigger>

      <Popover.Anchor />
      <Popover.Portal>
        <Popover.Content side="right">
          <EdittingSecondsInput
            defaultValue={defaultValue}
            min={min}
            max={max}
            setSeconds={(x) => {
              setOpen(false);
              setSeconds(x);
            }}
          />
          <Popover.Close />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

function EdittingSecondsInput({
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
  const input = useRef<HTMLInputElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  return (
    <div className="flex items-center rounded-md border border-gray-400">
      <input
        ref={input}
        className="p-2 text-center outline-none"
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
        className="rounded-md bg-green-400 p-2"
        onClick={() => {
          const current = input.current;
          if (current === null) {
            return;
          }
          setSeconds(getNumber(current.value) ?? 0);
        }}
      >
        <Check />
      </button>
    </div>
  );
}
