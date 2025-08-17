import { cn } from "../lib/tailwind";

const base =
  "bg-background border border-gray-700 rounded-md transition active:bg-gray-700";

export const buttonStyle = cn(base, "p-2 px-3");
export const iconButtonStyle = cn(base, "p-1");
