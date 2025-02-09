import React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
interface WorkspaceAvatarProps {
  imageUrl?: string;
  name: string;
  className?: string;
}

export function WorkspaceAvatar({
  imageUrl,
  name,
  className,
}: WorkspaceAvatarProps) {
  if (!imageUrl) {
    return (
      <Avatar className={cn("size-10 rounded-md", className)}>
        <AvatarFallback className="size-10 text-white bg-blue-600 font-semibold text-xl uppercase rounded-md">
          {name.charAt(0)}
        </AvatarFallback>
      </Avatar>
    );
  }
  return (
    <div
      className={cn("size-10 relative rounded-md overflow-hidden", className)}
    >
      <Image
        src={imageUrl}
        alt={`${name} workspace avatar`}
        fill
        className="object-cover"
      />
    </div>
  );
}
