"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/cn";

export function RefreshButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <button
      onClick={handleRefresh}
      disabled={isPending}
      className={cn(
        "inline-flex items-center justify-center p-2 rounded-sm border border-stone-3/30 bg-stone/30 hover:border-neon hover:bg-neon/10 text-ash hover:text-neon transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed",
        isPending && "border-neon bg-neon/10"
      )}
      title="Refresh bracket live data from start.gg"
    >
      <RefreshCw
        size={14}
        className={cn(
          "transition-transform duration-700",
          isPending && "animate-spin text-neon"
        )}
      />
    </button>
  );
}
