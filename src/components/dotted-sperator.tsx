import { cn } from "@/lib/utils";
import React from "react";

interface DottedSeparatorProps {
  className?: string;
  color?: string;
  size?: string;
  orientation?: "horizontal" | "vertical";
  gap?: string;
  height?: string;
}

export default function DottedSeparator({
  className,
  color = "#d9d9d9",
  size = "2px",
  height = "2px",
  orientation = "horizontal",
  gap = "6px",
}: DottedSeparatorProps) {
  const isHorizontal = orientation === "horizontal";

  return (
    <div
      className={cn(
        isHorizontal
          ? "flex items-center w-full "
          : "h-full flex flex-col items-center ",
        className
      )}
    >
      <div
        className={isHorizontal ? "flex-grow" : "flex-grow-0"}
        style={{
          height: isHorizontal ? height : "100%",
          width: isHorizontal ? "100%" : height,
          backgroundImage: `radial-gradient(circle, ${color} 25%, transparent 25%)`,
          backgroundSize: isHorizontal
            ? `${parseInt(size) + parseInt(gap)}px ${height}`
            : `${height} ${parseInt(size) + parseInt(gap)}px`,
          backgroundPosition: "center",
          backgroundRepeat: isHorizontal ? "repeat-x" : "repeat-y",
        }}
      />
    </div>
  );
}
