import React from "react";
import { UserButton } from "@/features/auth/components/user-button";
import { SidebarTrigger } from "../ui/sidebar";

export function DashboardNavBar() {
  return (
    <nav className="flex w-full items-center justify-between px-6 pt-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <div className="ms-2 hidden flex-col lg:flex">
          <h1 className="text-2xl font-bold">Home</h1>
          <p className="text-sm text-muted-foreground">
            Monitor all of your projects and tasks here
          </p>
        </div>
      </div>
      <UserButton />
    </nav>
  );
}
