import {
  ArrowLeftToLine,
  ArrowRightToLine,
  StepBack,
  StepForward,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";
import { Loading } from "./component/loading";
import { AddMarkButton, DeleteMarkButton } from "./component/mark-button";
import { MarkLoopToggleButton } from "./component/mark-loop-toggle-button";
import { PlayPauseButton } from "./component/play-pause-button";
import { PlaybackRateSlider } from "./component/playback-rate-slider";
import { RangeSlider } from "./component/range-slider";
import { SeekButton } from "./component/seek-button";
import {
  SeekToNextButton,
  SeekToPreviousButton,
} from "./component/seek-to-position-button";
import { SetRangeButton } from "./component/set-range-button";
import { TimeView } from "./component/time-view";
import { VideoUrlInput } from "./component/video-url-input";
import {
  PlayerStates,
  useYoutubePlayer,
  YoutubePlayerContainer,
} from "./component/youtube";
import { getNumber, getNumbers } from "./lib/parse";

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

  const cutStart = getNumber(searchParams.get("cutStart")) || 0;
  const [isCutStart, setIsCutStart] = useState(cutStart === 1);

  const cutEnd = getNumber(searchParams.get("cutEnd")) || 0;
  const [isCutEnd, setIsCutEnd] = useState(cutEnd === 1);

  const [marks, setMarks] = useState(getNumbers(searchParams.get("marks")));

  const [markLoopIndex, setMarkLoopIndex] = useState<number | null>(
    getNumber(searchParams.get("markLoopIndex")) ?? null,
  );

  const memoizedSetStartSeconds = useCallback(setStartSeconds, []);
  const memoizedSetEndSeconds = useCallback(setEndSeconds, []);
  const memoizedSetPlaybackRate = useCallback(setPlaybackRate, []);
  const toggleCutStart = useCallback(
    () => setIsCutStart(!isCutStart),
    [isCutStart],
  );
  const toggleCutEnd = useCallback(() => setIsCutEnd(!isCutEnd), [isCutEnd]);

  const arrowLeftToLineIcon = useMemo(() => <ArrowLeftToLine />, []);
  const stepBackIcon = useMemo(() => <StepBack />, []);
  const stepForwardIcon = useMemo(() => <StepForward />, []);
  const arrowRightToLineIcon = useMemo(() => <ArrowRightToLine />, []);

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
    marks,
    markLoopIndex,
  });

  const updateSearchParams = useCallback(() => {
    if (duration === 0) {
      return;
    }
    const params: Record<string, string> = {
      v: videoId,
      start: startSeconds.toString(),
      end: endSeconds?.toString() ?? duration.toString(),
      rate: playbackRate.toString(),
      marks: marks.join(","),
      markLoopIndex: markLoopIndex?.toString() ?? "",
      cutStart: isCutStart ? "1" : "0",
      cutEnd: isCutEnd ? "1" : "0",
    };
    setSearchParams(params);
  }, [
    videoId,
    startSeconds,
    endSeconds,
    duration,
    playbackRate,
    marks,
    markLoopIndex,
    isCutStart,
    isCutEnd,
    setSearchParams,
  ]);

  useEffect(() => {
    updateSearchParams();
  }, [updateSearchParams]);

  if (duration === 0 || player === null) {
    return <Loading />;
  }

  return (
    <div className="grid grid-cols-6 gap-y-4 px-4">
      <RangeSlider
        startSeconds={startSeconds}
        endSeconds={endSeconds}
        duration={duration}
        setStartSeconds={memoizedSetStartSeconds}
        setEndSeconds={memoizedSetEndSeconds}
        getCurrentTime={getCurrentTime}
        seekTo={seekTo}
        marks={marks}
        markLoopIndex={markLoopIndex}
        className="col-span-6 col-start-1"
        isCutStart={isCutStart}
        isCutEnd={isCutEnd}
      />

      <div className="col-span-1">
        <VideoUrlInput videoId={videoId} setVideoId={setVideoId} />
      </div>

      <div className="col-span-1 flex items-center gap-2">
        <AddMarkButton
          getCurrentTime={getCurrentTime}
          marks={marks}
          onAddMark={setMarks}
        />
        <DeleteMarkButton
          getCurrentTime={getCurrentTime}
          marks={marks}
          onDeleteMark={setMarks}
        />
        <MarkLoopToggleButton
          enabled={markLoopIndex !== null}
          marks={marks}
          onToggleMarkLoop={setMarkLoopIndex}
          getCurrentTime={getCurrentTime}
        />
      </div>

      <div className="col-span-2 flex items-center gap-5 justify-self-center">
        <TimeView
          seconds={startSeconds}
          onToggleCut={toggleCutStart}
          isCut={isCutStart}
          cutType="start"
        />
        <SetRangeButton
          getCurrentTime={getCurrentTime}
          setSeconds={memoizedSetStartSeconds}
          title="Set current time as start seconds"
        >
          {arrowLeftToLineIcon}
        </SetRangeButton>
        <SeekToPreviousButton
          pauseVideo={pauseVideo}
          seekTo={seekTo}
          getCurrentTime={getCurrentTime}
          marks={marks}
          fallbackSeconds={startSeconds}
        />
        <SeekButton
          pauseVideo={pauseVideo}
          getCurrentTime={getCurrentTime}
          seekTo={seekTo}
          seekOffset={-frame}
        >
          {stepBackIcon}
        </SeekButton>
        <PlayPauseButton
          playVideo={playVideo}
          pauseVideo={pauseVideo}
          isPaused={
            playerState === PlayerStates.PAUSED ||
            playerState === PlayerStates.UNSTARTED
          }
        />
        <SeekButton
          pauseVideo={pauseVideo}
          getCurrentTime={getCurrentTime}
          seekTo={seekTo}
          seekOffset={frame}
        >
          {stepForwardIcon}
        </SeekButton>
        <SeekToNextButton
          pauseVideo={pauseVideo}
          seekTo={seekTo}
          getCurrentTime={getCurrentTime}
          marks={marks}
          fallbackSeconds={Math.max(0, (endSeconds ?? duration) - 16 * frame)}
        />
        <SetRangeButton
          getCurrentTime={getCurrentTime}
          setSeconds={memoizedSetEndSeconds}
          title="Set current time as end seconds"
        >
          {arrowRightToLineIcon}
        </SetRangeButton>
        <TimeView
          seconds={endSeconds ?? duration}
          onToggleCut={toggleCutEnd}
          isCut={isCutEnd}
          cutType="end"
        />
      </div>

      <div className="col-span-2 flex w-9/12 items-center gap-2 justify-self-end">
        <PlaybackRateSlider
          playbackRate={playbackRate}
          availablePlaybackRates={availablePlaybackRates}
          setPlaybackRate={setPlayerPlaybackRate}
        />
      </div>
    </div>
  );
}
