"use client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import DottedSeparator from "@/components/dotted-sperator";
import { useLogout } from "../api/use-logout";
import { useFetchCurrentUser } from "../api/use-fetch-current-user";
import { Loader2, User, Settings, LogOut } from "lucide-react";
export const UserButton = () => {
  const { data: user, isLoading } = useFetchCurrentUser();
  const { mutate: logout } = useLogout();

  if (isLoading) {
    return (
      <div className="size-10 rounded-full bg-muted bg-neutral-200 border border-neutral-300 flex items-center justify-center">
        <Loader2 className="size-4 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (!user) {
    return null;
  }

  const { name, email } = user;

  const avatarFallback = name
    ? name?.charAt(0).toUpperCase()
    : email?.charAt(0).toUpperCase() ?? "U";
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild className="relative">
        <Avatar className="size-10 hover:opacity-75 transition cursor-pointer border border-neutral-300">
          <AvatarFallback className="flex items-center justify-center font-medium bg-neutral-200 text-neutral-500">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-60"
        align="end"
        side="bottom"
        sideOffset={10}
      >
        <div className="flex flex-col justify-center items-center gap-2 px-2.5 py-4 ">
          <Avatar className="size-10 hover:opacity-75 transition cursor-pointer border border-neutral-300">
            <AvatarFallback className="flex items-center justify-center text-xl font-medium bg-neutral-200 text-neutral-500">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1 justify-center items-center">
            <p className="text-sm font-medium text-neutral-900">
              {name || "User"}
            </p>
            <p className="text-xs text-neutral-500">{email}</p>
          </div>
        </div>
        <DottedSeparator className="mb-1" />
        <DropdownMenuItem
          className="h-10 cursor-pointer text-amber-700 font-medium flex items-center justify-center gap-2"
          onClick={() => logout()}
        >
          <LogOut className="size-4 mr-2" />
          Logout
        </DropdownMenuItem>
        <DottedSeparator />
        <DropdownMenuItem>
          <User className="size-4 mr-2" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="size-4 mr-2" />
          Settings
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
