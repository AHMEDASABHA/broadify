"use client";
import React from "react";
import { UserButton } from "@/features/auth/components/user-button";
import { usePathname } from "next/navigation";
import { SidebarTrigger } from "../ui/sidebar";

const pathNameMap = {
  tasks: {
    title: "Tasks",
    description: "View all of your tasks here",
  },
  projects: {
    title: "Projects",
    description: "View all of your projects here",
  },
  members: {
    title: "Members",
    description: "View all of your members here",
  },
  settings: {
    title: "Settings",
    description: "View all of your settings here",
  },
};

const defaultMap = {
  title: "Home",
  description: "Monitor all of your projects and tasks here",
};

export function DashboardNavBar() {
  const pathname = usePathname();
  const pathnameParts = pathname.split("/");
  const pathnameKey = pathnameParts[3] as keyof typeof pathNameMap;
  const { title, description } = pathNameMap[pathnameKey] || defaultMap;

  return (
    <nav className="flex w-full items-center justify-between px-6 pt-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <div className="ms-2 hidden flex-col lg:flex">
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <UserButton />
    </nav>
  );
}
