import { Loader2 } from "lucide-react";

export const Loading = () => {
  return (
    <div className="flex w-full h-full items-center justify-center">
      <Loader2 size={32} className="animate-spin" />
    </div>
  );
};

export const LoadingOr = ({
  isLoading,
  children,
}: React.PropsWithChildren<{
  isLoading: boolean;
}>) => {
  if (!isLoading) {
    return children;
  }
  return <Loading />;
};
