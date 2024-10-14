import { StepBack, StepForward } from "lucide-react";
import { useEffect } from "react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { LoadingOr } from "~/component/loading";
import { PlayPauseButton } from "~/component/play-pause-button";
import { PlaybackRateSlider } from "~/component/playback-rate-slider";
import { RangeSlider } from "~/component/range-slider";
import { SecondsInput } from "~/component/seconds-input";
import { SeekButton } from "~/component/seek-button";
import { VideoUrlInput } from "~/component/video-url-input";
import {
  type PlayerState,
  type YouTubePlayer,
  YoutubePlayerContainer,
  useYoutubePlayer,
} from "~/component/youtube";
import { getNumber } from "~/lib/parse";

export function PlayerRoute() {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialVideoId = searchParams.get("v") ?? "M7lc1UVf-VE";

  const start = getNumber(searchParams.get("start")) || 0;
  const [startSeconds, setStartSeconds] = useState(start);

  const end = getNumber(searchParams.get("end"));
  const [endSeconds, setEndSeconds] = useState(end);

  const {
    player,
    playerState,
    videoId,
    setVideoId,
    duration,
    playbackRate,
    availablePlaybackRates,
  } = useYoutubePlayer({
    initialVideoId,
    startSeconds,
    endSeconds,
  });

  useEffect(() => {
    setSearchParams({
      v: videoId,
      start: startSeconds.toString(),
      end: endSeconds?.toString() ?? "",
    });
  }, [videoId, startSeconds, endSeconds, setSearchParams]);

  return (
    <div className="h-svh w-svw grid grid-rows-[85%_15%] justify-center items-center">
      <YoutubePlayerContainer />
      <LoadingOr isLoading={duration === 0}>
        <PlayerController
          player={player}
          playerState={playerState}
          videoId={videoId}
          setVideoId={setVideoId}
          startSeconds={startSeconds}
          endSeconds={endSeconds}
          duration={duration ?? 0}
          setStartSeconds={setStartSeconds}
          setEndSeconds={setEndSeconds}
          playbackRate={playbackRate}
          availablePlaybackRates={availablePlaybackRates}
        />
      </LoadingOr>
    </div>
  );
}

const frame = 1 / 30;

function PlayerController({
  player,
  playerState,
  videoId,
  setVideoId,
  startSeconds,
  endSeconds,
  duration,
  setStartSeconds,
  setEndSeconds,
  playbackRate,
  availablePlaybackRates,
}: {
  player: YouTubePlayer | null;
  playerState: PlayerState;
  videoId: string;
  setVideoId: (x: string) => void;
  startSeconds: number;
  endSeconds?: number;
  duration: number;
  setStartSeconds: (x: number) => void;
  setEndSeconds: (x: number) => void;
  playbackRate: number;
  availablePlaybackRates: number[];
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

        <VideoUrlInput videoId={videoId} setVideoId={setVideoId} />

        <PlaybackRateSlider
          playbackRate={playbackRate}
          availablePlaybackRates={availablePlaybackRates}
          player={player}
        />
      </div>
    </div>
  );
}
