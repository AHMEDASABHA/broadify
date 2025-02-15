import React from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/appside-bar";
import { cookies } from "next/headers";
import { DashboardNavBar } from "@/components/dashboard/nav-bar-dash";
import { CreateWorkspaceModel } from "@/features/workspaces/components/create-workspace-model";
import { CreateProjectModel } from "@/features/projects/components/create-project-model";
import { CreateTaskModel } from "@/features/tasks/components/create-task-model";
import { EditTaskModel } from "@/features/tasks/components/update-task-model";
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <div className="min-h-screen w-full">
        <CreateWorkspaceModel />
        <CreateProjectModel />
        <CreateTaskModel />
        <EditTaskModel />
        <div className="flex h- full">
          <AppSidebar />
          <SidebarInset className="w-full">
            <DashboardNavBar />
            <main className="flex flex-col py-8 px-6 h-full">{children}</main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
