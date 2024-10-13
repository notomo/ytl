import { StepBack, StepForward } from "lucide-react";
import { useEffect } from "react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { RangeSlider } from "./RangeSlider";
import { SecondsInput } from "./SecondsInput";
import { SeekButton } from "./SeekButton";
import { LoadingOr } from "./loading";
import { getNumber } from "./parse";
import {
  type YouTubePlayer,
  YoutubePlayerContainer,
  useYoutubePlayer,
} from "./youtube";

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
      <LoadingOr isLoading={duration === 0}>
        <PlayerController
          player={player}
          startSeconds={startSeconds}
          endSeconds={endSeconds}
          duration={duration ?? 0}
          setStartSeconds={setStartSeconds}
          setEndSeconds={setEndSeconds}
        />
      </LoadingOr>
    </div>
  );
}

const frame = 1 / 30;

function PlayerController({
  player,
  startSeconds,
  endSeconds,
  duration,
  setStartSeconds,
  setEndSeconds,
}: {
  player: YouTubePlayer | null;
  startSeconds: number;
  endSeconds?: number;
  duration: number;
  setStartSeconds: (x: number) => void;
  setEndSeconds: (x: number) => void;
}) {
  return (
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
  );
}
