export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / (60 * 60));
  const minutes = Math.floor((seconds - hours * 60 * 60) / 60);
  const restSeconds = Math.floor(seconds - minutes * 60 - hours * 60 * 60);

  return `${hours > 0 ? `${hours}:` : ""}${minutes.toString().padStart(2, "0")}:${restSeconds.toString().padStart(2, "0")}`;
}
