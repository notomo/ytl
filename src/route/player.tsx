import { StepBack, StepForward } from "lucide-react";
import { useEffect } from "react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { LoadingOr } from "~/component/loading";
import { PlayPauseButton } from "~/component/play-pause-button";
import { RangeSlider } from "~/component/range-slider";
import { SecondsInput } from "~/component/seconds-input";
import { SeekButton } from "~/component/seek-button";
import {
  type PlayerState,
  type YouTubePlayer,
  YoutubePlayerContainer,
  useYoutubePlayer,
} from "~/component/youtube";
import { getNumber } from "~/lib/parse";

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

  const { player, playerState, duration } = useYoutubePlayer({
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
          playerState={playerState}
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
  playerState,
  startSeconds,
  endSeconds,
  duration,
  setStartSeconds,
  setEndSeconds,
}: {
  player: YouTubePlayer | null;
  playerState: PlayerState;
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

      <div className="flex items-center justify-center gap-5">
        <SecondsInput
          defaultValue={startSeconds}
          setSeconds={setStartSeconds}
          min={0}
          max={endSeconds || duration}
        />

        <SeekButton player={player} seekOffset={-frame}>
          <StepBack />
        </SeekButton>

        <PlayPauseButton player={player} playerState={playerState} />

        <SeekButton player={player} seekOffset={frame}>
          <StepForward />
        </SeekButton>

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
