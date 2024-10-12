import { Loader2, StepBack, StepForward } from "lucide-react";
import { useEffect } from "react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { RangeSlider } from "./RangeSlider";
import { SecondsInput } from "./SecondsInput";
import { SeekButton } from "./SeekButton";
import { getNumber } from "./parse";
import { PlayerStates, type YouTubePlayer } from "./youtube";

const frame = 1 / 30;

export function PlayerRoute() {
  const [searchParams, setSearchParams] = useSearchParams();

  const videoId = searchParams.get("v") ?? "M7lc1UVf-VE";

  const start = getNumber(searchParams.get("start")) || 0;
  const [startSeconds, setStartSeconds] = useState(start);

  const end = getNumber(searchParams.get("end"));
  const [endSeconds, setEndSeconds] = useState(end);

  const [player, setPlayer] = useState<YouTubePlayer | null>(null);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    setSearchParams({
      v: videoId,
      start: startSeconds.toString(),
      end: endSeconds?.toString() ?? "",
    });
  }, [videoId, startSeconds, endSeconds, setSearchParams]);

  return (
    <div className="h-svh w-svw grid grid-rows-[85%_15%] justify-center items-center">
      <Player
        videoId={videoId}
        startSeconds={startSeconds}
        endSeconds={endSeconds}
        player={player}
        setPlayer={setPlayer}
        setDuration={setDuration}
      />
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

const playerId = "player";

function Player({
  videoId,
  startSeconds,
  endSeconds,
  player,
  setPlayer,
  setDuration,
}: {
  videoId: string;
  startSeconds: number;
  endSeconds?: number;
  player: YouTubePlayer | null;
  setPlayer: (player: YouTubePlayer | null) => void;
  setDuration: (duration: number) => void;
}) {
  useEffect(() => {
    window.onYoutubeStateChange = (event) => {
      switch (event.data) {
        case PlayerStates.ENDED: {
          event.target.seekTo(startSeconds, true);
          event.target.playVideo();
          break;
        }
        case PlayerStates.VIDEO_CUED: {
          setPlayer(event.target);
          setDuration(event.target.getDuration());
          event.target.playVideo();
          break;
        }
      }
    };

    if (player !== null) {
      player.cueVideoById({
        videoId,
        startSeconds,
        endSeconds,
      });
      return;
    }

    window.onYouTubeIframeAPIReady = () => {
      new window.YT.Player(playerId, {
        videoId,

        // workaround for tablet
        width: "1000",
        height: "563",

        events: {
          onReady: (event) => {
            event.target.cueVideoById({
              videoId,
              startSeconds,
              endSeconds,
            });
          },
          onStateChange: (event) => {
            window.onYoutubeStateChange(event);
          },
        },
      });
    };

    const head = document.getElementsByTagName("head")[0];
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    head?.appendChild(script);
    return () => {
      head?.removeChild(script);
    };
  }, [videoId, startSeconds, endSeconds, player, setPlayer, setDuration]);

  return (
    <div className="flex items-center w-full h-full aspect-video">
      {/* xl is workaround for tablet */}
      <div id={playerId} className="xl:w-full xl:h-full" />
    </div>
  );
}
