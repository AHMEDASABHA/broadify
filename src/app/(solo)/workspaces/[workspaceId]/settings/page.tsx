import React from "react";
import { WorkspaceSettingsPageClient } from "./client";
interface SingleWorkspaceSettingsPageProps {
  params: Promise<{
    workspaceId: string;
  }>;
}

export default async function SingleWorkspaceSettingsPage({
  params,
}: SingleWorkspaceSettingsPageProps) {
  const { workspaceId } = await params;

  return <WorkspaceSettingsPageClient workspaceId={workspaceId} />;
}
