import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { RangeSlider } from "./RangeSlider";
import { PlayerStates, type YouTubePlayer } from "./youtube";

const getNumber = (v: string | null) => {
  if (v === null) {
    return undefined;
  }
  const n = Number(v);
  if (Number.isNaN(n)) {
    return undefined;
  }
  return n;
};

export function PlayerRoute() {
  const [searchParams] = useSearchParams();

  const videoId = searchParams.get("v") ?? "M7lc1UVf-VE";

  const start = getNumber(searchParams.get("start")) || 0;
  const [startSeconds, setStartSeconds] = useState(start);

  const end = getNumber(searchParams.get("end"));
  const [endSeconds, setEndSeconds] = useState(end);

  const [player, setPlayer] = useState<YouTubePlayer | null>(null);
  const duration = player?.getDuration();

  return (
    <div className="h-screen w-screen grid grid-rows-[85%_15%] justify-center items-center">
      <Player
        videoId={videoId}
        startSeconds={startSeconds}
        endSeconds={endSeconds}
        player={player}
        setPlayer={setPlayer}
      />
      <div className="px-10">
        {duration === undefined || duration === 0 ? (
          <div className="flex w-full justify-center items-center">
            <Loader2 size={32} className="animate-spin" />
          </div>
        ) : (
          <RangeSlider
            startSeconds={startSeconds}
            endSeconds={endSeconds}
            duration={duration ?? 0}
            setStartSeconds={setStartSeconds}
            setEndSeconds={setEndSeconds}
          />
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
}: {
  videoId: string;
  startSeconds: number;
  endSeconds?: number;
  player: YouTubePlayer | null;
  setPlayer: (player: YouTubePlayer | null) => void;
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
      player.playVideo();
      return;
    }

    window.onYouTubeIframeAPIReady = () => {
      new window.YT.Player(playerId, {
        videoId,
        events: {
          onReady: (event) => {
            event.target.cueVideoById({
              videoId,
              startSeconds,
              endSeconds,
            });
            event.target.playVideo();
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
  }, [videoId, startSeconds, endSeconds, player, setPlayer]);

  return <div id={playerId} className="h-full w-full aspect-video" />;
}
