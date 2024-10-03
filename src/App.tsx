import { useEffect } from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  useSearchParams,
} from "react-router-dom";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<PlayerRoute />} />
      </Routes>
    </BrowserRouter>
  );
}

function PlayerRoute() {
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get("v") ?? "M7lc1UVf-VE";
  const startSeconds = Number.parseInt(searchParams.get("start") ?? "");
  const endSeconds = Number.parseInt(searchParams.get("end") ?? "");
  return (
    <div className="h-screen w-screen grid grid-rows-[85%_15%] justify-center items-center">
      <Player
        videoId={videoId}
        startSeconds={startSeconds}
        endSeconds={endSeconds}
      />
      <div>WIP</div>
    </div>
  );
}

interface YouTubePlayer {
  cueVideoById({
    videoId,
    startSeconds,
    endSeconds,
  }: {
    videoId: string;
    startSeconds?: number;
    endSeconds?: number;
  }): void;
  seekTo(startSeconds: number, allowSeekAhead: boolean): void;
  playVideo(): void;
}

interface IframeApiType {
  Player: {
    new (
      elementId: string,
      options: {
        videoId: string;
        events: {
          onReady: (event: { target: YouTubePlayer }) => void;
          onStateChange: (event: {
            data: PlayerState;
            target: YouTubePlayer;
          }) => void;
        };
      },
    ): YouTubePlayer;
  };
}

declare global {
  var YT: IframeApiType;
  var onYouTubeIframeAPIReady: () => void;
}

const PlayerStates = {
  UNSTARTED: -1,
  ENDED: 0,
  PLAYING: 1,
  PAUSED: 2,
  BUFFERING: 3,
  VIDEO_CUED: 5,
} as const;
type PlayerState = (typeof PlayerStates)[keyof typeof PlayerStates];

const playerId = "player";

function Player({
  videoId,
  startSeconds = 0,
  endSeconds,
}: {
  videoId: string;
  startSeconds?: number;
  endSeconds?: number;
}) {
  useEffect(() => {
    window.onYouTubeIframeAPIReady = () => {
      new window.YT.Player(playerId, {
        videoId,
        events: {
          onReady: (event: { target: YouTubePlayer }) => {
            event.target.cueVideoById({
              videoId,
              startSeconds,
              endSeconds,
            });
            event.target.playVideo();
          },
          onStateChange: (event: {
            data: PlayerState;
            target: YouTubePlayer;
          }) => {
            switch (event.data) {
              case PlayerStates.ENDED: {
                event.target.seekTo(startSeconds, true);
                event.target.playVideo();
                break;
              }
            }
          },
        },
      });
    };

    const head = document.getElementsByTagName("head")[0];
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    head.appendChild(script);
    return () => {
      script.remove();
    };
  }, [videoId, startSeconds, endSeconds]);

  return <div id={playerId} className="h-full w-full aspect-video" />;
}
