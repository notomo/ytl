import {
  ArrowLeftToLine,
  ArrowRightToLine,
  StepBack,
  StepForward,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { Loading } from "~/component/loading";
import { PlayPauseButton } from "~/component/play-pause-button";
import { PlaybackRateSlider } from "~/component/playback-rate-slider";
import { RangeSlider } from "~/component/range-slider";
import { SeekButton } from "~/component/seek-button";
import { SetRangeButton } from "~/component/set-range-button";
import { TimeView } from "~/component/time-view";
import { VideoUrlInput } from "~/component/video-url-input";
import { useYoutubePlayer, YoutubePlayerContainer } from "~/component/youtube";
import { getNumber } from "~/lib/parse";

export function PlayerRoute() {
  return (
    <div className="h-svh w-svw grid grid-rows-[85%_15%] justify-center items-center">
      <YoutubePlayerContainer />
      <PlayerController />
    </div>
  );
}

const frame = 1 / 30;

function PlayerController() {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialVideoId = searchParams.get("v") ?? "M7lc1UVf-VE";

  const start = getNumber(searchParams.get("start")) || 0;
  const [startSeconds, setStartSeconds] = useState(start);

  const end = getNumber(searchParams.get("end"));
  const [endSeconds, setEndSeconds] = useState(end);

  const rate = getNumber(searchParams.get("rate")) || 1;
  const [playbackRate, setPlaybackRate] = useState(rate);

  const {
    player,
    playerState,
    videoId,
    setVideoId,
    duration,
    availablePlaybackRates,
  } = useYoutubePlayer({
    initialVideoId,
    playbackRate,
    startSeconds,
    endSeconds,
    setPlaybackRate,
  });

  const updateSearchParams = useCallback(() => {
    if (duration === 0) {
      return;
    }
    setSearchParams({
      v: videoId,
      start: startSeconds.toString(),
      end: endSeconds?.toString() ?? duration.toString(),
      rate: playbackRate.toString(),
    });
  }, [
    videoId,
    startSeconds,
    endSeconds,
    duration,
    playbackRate,
    setSearchParams,
  ]);

  useEffect(() => {
    updateSearchParams();
  }, [updateSearchParams]);

  if (duration === 0 || player === null) {
    return <Loading />;
  }

  return (
    <div className="grid grid-cols-3 gap-y-4">
      <RangeSlider
        startSeconds={startSeconds}
        endSeconds={endSeconds}
        duration={duration}
        setStartSeconds={setStartSeconds}
        setEndSeconds={setEndSeconds}
        player={player}
        className="col-start-1 col-span-3"
      />

      <div className="col-span-1">
        <VideoUrlInput videoId={videoId} setVideoId={setVideoId} />
      </div>

      <div className="col-start-2 col-span-1 justify-self-center flex items-center gap-5">
        <TimeView seconds={startSeconds} />

        <SetRangeButton
          player={player}
          setSeconds={setStartSeconds}
          title="Set current time as start seconds"
        >
          <ArrowLeftToLine />
        </SetRangeButton>

        <SeekButton player={player} seekOffset={-frame}>
          <StepBack />
        </SeekButton>

        <PlayPauseButton player={player} playerState={playerState} />

        <SeekButton player={player} seekOffset={frame}>
          <StepForward />
        </SeekButton>

        <SetRangeButton
          player={player}
          setSeconds={setEndSeconds}
          title="Set current time as end seconds"
        >
          <ArrowRightToLine />
        </SetRangeButton>

        <TimeView seconds={endSeconds ?? duration} />
      </div>

      <div className="col-span-1 justify-self-end flex items-center gap-2">
        <PlaybackRateSlider
          playbackRate={playbackRate}
          availablePlaybackRates={availablePlaybackRates}
          player={player}
        />
      </div>
    </div>
  );
}
