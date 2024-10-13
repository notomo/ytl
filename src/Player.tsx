import { Loader2, StepBack, StepForward } from "lucide-react";
import { useEffect } from "react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { RangeSlider } from "./RangeSlider";
import { SecondsInput } from "./SecondsInput";
import { SeekButton } from "./SeekButton";
import { getNumber } from "./parse";
import { YoutubePlayerContainer, useYoutubePlayer } from "./youtube";

const frame = 1 / 30;

export function PlayerRoute() {
  const [searchParams, setSearchParams] = useSearchParams();

  const videoId = searchParams.get("v") ?? "M7lc1UVf-VE";

  const start = getNumber(searchParams.get("start")) || 0;
  const [startSeconds, setStartSeconds] = useState(start);

  const end = getNumber(searchParams.get("end"));
  const [endSeconds, setEndSeconds] = useState(end);

  useEffect(() => {
    setSearchParams({
      v: videoId,
      start: startSeconds.toString(),
      end: endSeconds?.toString() ?? "",
    });
  }, [videoId, startSeconds, endSeconds, setSearchParams]);

  const { player, duration } = useYoutubePlayer({
    videoId,
    startSeconds,
    endSeconds,
  });

  return (
    <div className="h-svh w-svw grid grid-rows-[85%_15%] justify-center items-center">
      <YoutubePlayerContainer />
      <div>
        {duration === 0 ? (
          <div className="flex w-full justify-center items-center">
            <Loader2 size={32} className="animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            <RangeSlider
              startSeconds={startSeconds}
              endSeconds={endSeconds}
              duration={duration ?? 0}
              setStartSeconds={setStartSeconds}
              setEndSeconds={setEndSeconds}
            />
            <div className="flex items-center justify-between">
              <SecondsInput
                defaultValue={startSeconds}
                setSeconds={setStartSeconds}
                min={0}
                max={endSeconds || duration}
              />
              <div className="flex items-center gap-5">
                <SeekButton player={player} seekOffset={-frame}>
                  <StepBack />
                </SeekButton>
                <SeekButton player={player} seekOffset={frame}>
                  <StepForward />
                </SeekButton>
              </div>
              <SecondsInput
                defaultValue={endSeconds ?? duration}
                setSeconds={setEndSeconds}
                min={startSeconds}
                max={duration}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
