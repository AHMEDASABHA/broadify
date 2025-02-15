"use client";
import React from "react";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetSingleTask } from "../api/use-get-single-task";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { Card, CardContent } from "@/components/ui/card";
import { UpdateTaskForm } from "./update-task-form";
import { Loader2 } from "lucide-react";
interface UpdateTaskFormWrapperProps {
  onCancel?: () => void;
  taskId: string;
}

export function UpdateTaskFormWrapper({
  onCancel,
  taskId,
}: UpdateTaskFormWrapperProps) {
  const workspaceId = useWorkspaceId();

  const { data: initialTaskValues, isLoading: isTaskLoading } =
    useGetSingleTask({
      taskId,
    });

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

  const isLoading = isProjectsLoading || isMembersLoading || isTaskLoading;

  if (isLoading || !projectOptions || !memberOptions || !initialTaskValues) {
    return (
      <Card className="w-full h-[714px] flex items-center justify-center">
        <CardContent className="flex items-center justify-center h-full">
          <Loader2 className="size-5 text-muted-foreground animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (!initialTaskValues) {
    return null;
  }

  return (
    <UpdateTaskForm
      onCancel={onCancel}
      initialTaskValues={initialTaskValues}
      projectOptions={projectOptions}
      memberOptions={memberOptions}
    />
  );
}
