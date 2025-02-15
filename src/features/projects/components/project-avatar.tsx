import React from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ProjectAvatarProps {
  imageUrl?: string;
  name: string;
  className?: string;
  fallbackClassName?: string;
}

export function ProjectAvatar({
  imageUrl,
  name,
  className,
  fallbackClassName,
}: ProjectAvatarProps) {
  const avatarSize = "size-5"; // Define a consistent size for the avatar

  if (!imageUrl) {
    return (
      <Avatar
        className={cn(`${avatarSize} rounded-md`, className)}
        aria-label={`${name} project avatar`}
      >
        <AvatarFallback
          className={cn(
            `${avatarSize} text-white bg-blue-600 font-semibold text-sm rounded-md`,
            fallbackClassName
          )}
        >
          {name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
    );
  }

  return (
    <div
      className={cn(
        `${avatarSize} relative rounded-md overflow-hidden`,
        className
      )}
      aria-label={`${name} project avatar`}
    >
      <Image
        src={imageUrl}
        alt={`${name} project avatar`}
        fill
        className="object-cover"
      />
    </div>
  );
}
