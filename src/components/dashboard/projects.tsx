"use client";
import { SidebarGroupLabel } from "../ui/sidebar";
import React from "react";
import Link from "next/link";

import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";

import { RiAddCircleFill } from "react-icons/ri";

import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useCreateProjectModel } from "@/features/projects/hooks/use-create-project-model";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";

export function Projects() {
  const workspaceId = useWorkspaceId();
  const { data: projects } = useGetProjects({ workspaceId });
  const pathname = usePathname();
  const { open: openProjectCreationModel } = useCreateProjectModel();

  return (
    <SidebarGroup>
      <SidebarGroupLabel asChild>
        <p className="text-xs uppercase text-neutral-500 font-medium">
          Projects
        </p>
      </SidebarGroupLabel>
      <SidebarGroupAction>
        <RiAddCircleFill
          onClick={openProjectCreationModel}
          className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition"
        />
      </SidebarGroupAction>
      <SidebarGroupContent>
        <SidebarMenu>
          {projects?.documents.map((project) => {
            const fullHref = `/workspaces/${workspaceId}/projects/${project.$id}`;
            const isActive = pathname === fullHref;

            return (
              <SidebarMenuItem key={project.$id}>
                <SidebarMenuButton asChild>
                  <Link href={fullHref}>
                    <div
                      className={cn(
                        "flex items-center justify-start font-medium rounded-md gap-4 py-8 hover:text-primary transition text-neutral-500",
                        isActive &&
                          "bg-white shadow-sm hover:opacity-100 text-primary"
                      )}
                    >
                      <ProjectAvatar
                        imageUrl={project.imageUrl}
                        name={project.name}
                      />
                      <span className="text-xl truncate me-1">
                        {project.name}
                      </span>
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
