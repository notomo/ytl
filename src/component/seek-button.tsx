import type { YouTubePlayer } from "./youtube";

export function SeekButton({
  player,
  seekOffset,
  children,
}: React.PropsWithChildren<{
  player: YouTubePlayer;
  seekOffset: number;
}>) {
  return (
    <button
      type="button"
      onClick={() => {
        player.pauseVideo();

        const currentTime = player.getCurrentTime();
        player.seekTo(currentTime + seekOffset, true);
      }}
    >
      {children}
    </button>
  );
}
