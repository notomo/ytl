import type { YouTubePlayer } from "./youtube";

export function PlaybackRateSlider({
  player,
  playbackRate,
  availablePlaybackRates,
}: {
  player: YouTubePlayer;
  playbackRate: number;
  availablePlaybackRates: number[];
}) {
  const min = Math.min(...availablePlaybackRates);
  const max = Math.max(...availablePlaybackRates);
  return (
    <div className="flex items-center gap-2">
      <input
        type="range"
        min={min}
        max={max}
        step={0.25}
        defaultValue={playbackRate}
        onChange={(e) => {
          player.setPlaybackRate(Number(e.currentTarget.value));
        }}
      />
      {playbackRate}
    </div>
  );
}
