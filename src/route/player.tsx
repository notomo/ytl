import {
  ArrowLeftToLine,
  ArrowRightToLine,
  StepBack,
  StepForward,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { Loading } from "~/component/loading";
import { PlayPauseButton } from "~/component/play-pause-button";
import { PlaybackRateSlider } from "~/component/playback-rate-slider";
import { RangeSlider } from "~/component/range-slider";
import { SeekButton } from "~/component/seek-button";
import { SetRangeButton } from "~/component/set-range-button";
import { TimeView } from "~/component/time-view";
import { VideoUrlInput } from "~/component/video-url-input";
import {
  PlayerStates,
  useYoutubePlayer,
  YoutubePlayerContainer,
} from "~/component/youtube";
import { getNumber } from "~/lib/parse";

export function PlayerRoute() {
  return (
    <div className="grid h-svh w-svw grid-rows-[85%_15%] items-center justify-center">
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

  const memoizedSetStartSeconds = useCallback(setStartSeconds, []);
  const memoizedSetEndSeconds = useCallback(setEndSeconds, []);
  const memoizedSetPlaybackRate = useCallback(setPlaybackRate, []);

  const memoizedArrowLeftToLine = useMemo(() => <ArrowLeftToLine />, []);
  const memoizedStepBack = useMemo(() => <StepBack />, []);
  const memoizedStepForward = useMemo(() => <StepForward />, []);
  const memoizedArrowRightToLine = useMemo(() => <ArrowRightToLine />, []);

  const {
    player,
    playerState,
    videoId,
    setVideoId,
    duration,
    availablePlaybackRates,
    playVideo,
    pauseVideo,
    getCurrentTime,
    seekTo,
    setPlaybackRate: setPlayerPlaybackRate,
  } = useYoutubePlayer({
    initialVideoId,
    playbackRate,
    startSeconds,
    endSeconds,
    setPlaybackRate: memoizedSetPlaybackRate,
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
        setStartSeconds={memoizedSetStartSeconds}
        setEndSeconds={memoizedSetEndSeconds}
        getCurrentTime={getCurrentTime}
        className="col-span-3 col-start-1"
      />

      <div className="col-span-1">
        <VideoUrlInput videoId={videoId} setVideoId={setVideoId} />
      </div>

      <div className="col-span-1 col-start-2 flex items-center gap-5 justify-self-center">
        <TimeView seconds={startSeconds} />
        <SetRangeButton
          getCurrentTime={getCurrentTime}
          setSeconds={memoizedSetStartSeconds}
          title="Set current time as start seconds"
        >
          {memoizedArrowLeftToLine}
        </SetRangeButton>
        <SeekButton
          pauseVideo={pauseVideo}
          getCurrentTime={getCurrentTime}
          seekTo={seekTo}
          seekOffset={-frame}
        >
          {memoizedStepBack}
        </SeekButton>
        <PlayPauseButton
          playVideo={playVideo}
          pauseVideo={pauseVideo}
          isPaused={playerState === PlayerStates.PAUSED}
        />
        <SeekButton
          pauseVideo={pauseVideo}
          getCurrentTime={getCurrentTime}
          seekTo={seekTo}
          seekOffset={frame}
        >
          {memoizedStepForward}
        </SeekButton>
        <SetRangeButton
          getCurrentTime={getCurrentTime}
          setSeconds={memoizedSetEndSeconds}
          title="Set current time as end seconds"
        >
          {memoizedArrowRightToLine}
        </SetRangeButton>
        <TimeView seconds={endSeconds ?? duration} />
      </div>

      <div className="col-span-1 flex items-center gap-2 justify-self-end">
        <PlaybackRateSlider
          playbackRate={playbackRate}
          availablePlaybackRates={availablePlaybackRates}
          setPlaybackRate={setPlayerPlaybackRate}
        />
      </div>
    </div>
  );
}
