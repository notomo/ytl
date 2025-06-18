export function TimeView({ seconds }: { seconds: number }) {
  const hours = Math.floor(seconds / (60 * 60));
  const minutes = Math.floor((seconds - hours * 60 * 60) / 60);
  const restSeconds = seconds - minutes * 60 - hours * 60 * 60;
  const time = `${hours > 0 ? `${hours}:` : ""}${minutes.toString().padStart(2, "0")}:${restSeconds.toString().padStart(2, "0")}`;
  return <div className="underline underline-offset-8">{time}</div>;
}
