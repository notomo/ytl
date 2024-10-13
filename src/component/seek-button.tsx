import type { YouTubePlayer } from "./youtube";

export function SeekButton({
  player,
  seekOffset,
  children,
}: React.PropsWithChildren<{
  player: YouTubePlayer | null;
  seekOffset: number;
}>) {
  return (
    <button
      type="button"
      onClick={() => {
        if (!player) {
          return;
        }

        player.pauseVideo();

        const currentTime = player.getCurrentTime();
        player.seekTo(currentTime + seekOffset, true);
      }}
    >
      {children}
    </button>
  );
}
