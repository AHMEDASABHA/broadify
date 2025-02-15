import { AlertTriangle } from "lucide-react";
import React from "react";

export function PageError({
  errorMessage = "Something went wrong",
}: {
  errorMessage: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <AlertTriangle className="size-6 mb-2 text-red-500" />
      <p className="text-sm text-muted-foreground font-medium">
        {errorMessage}
      </p>
    </div>
  );
}
