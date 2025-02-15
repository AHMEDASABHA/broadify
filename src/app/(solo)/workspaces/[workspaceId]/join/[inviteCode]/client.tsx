"use client";

import React from "react";
import JoinWorkspaceForm from "@/features/workspaces/components/join-workspace-form";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { PageError } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";
import { useGetWorkspaceInfo } from "@/features/workspaces/api/use-get-single-workspace-info";

export function JoinWorkspaceClient() {
  const workspaceId = useWorkspaceId();
  const { data: workspace, isLoading } = useGetWorkspaceInfo({
    workspaceId,
  });

  if (isLoading) {
    return <PageLoader />;
  }
  if (!workspace) {
    return <PageError errorMessage="Workspace not found" />;
  }

  return <JoinWorkspaceForm workspaceName={workspace.name} />;
}
