"use client";
import React from "react";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { Card, CardContent } from "@/components/ui/card";
import { CreateTaskForm } from "./create-task-form";
import { Loader2 } from "lucide-react";
import type { TaskStatus } from "../types/task-status";

interface CreateTaskFormWrapperProps {
  onCancel?: () => void;
  board?: TaskStatus | null;
}

export function CreateTaskFormWrapper({
  onCancel,
  board,
}: CreateTaskFormWrapperProps) {
  const workspaceId = useWorkspaceId();

  const { data: projects, isLoading: isProjectsLoading } = useGetProjects({
    workspaceId,
  });
  const { data: members, isLoading: isMembersLoading } = useGetMembers({
    workspaceId,
  });

  const projectOptions = projects?.documents.map((project) => ({
    name: project.name,
    id: project.$id,
    imageUrl: project.imageUrl,
  }));

  const memberOptions = members?.documents.map((member) => ({
    name: member.name,
    id: member.$id,
  }));

  const isLoading = isProjectsLoading || isMembersLoading;

  if (isLoading || !projectOptions || !memberOptions) {
    return (
      <Card className="w-full h-[714px] flex items-center justify-center">
        <CardContent className="flex items-center justify-center h-full">
          <Loader2 className="size-5 text-muted-foreground animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <CreateTaskForm
      onCancel={onCancel}
      projectOptions={projectOptions}
      memberOptions={memberOptions}
      board={board as TaskStatus}
    />
  );
}
