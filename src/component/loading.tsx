import { Loader2 } from "lucide-react";

export const Loading = () => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Loader2 size={32} className="animate-spin" />
    </div>
  );
};
