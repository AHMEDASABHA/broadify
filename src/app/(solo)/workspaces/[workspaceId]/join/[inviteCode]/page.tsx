import { getWorkspaceNameById } from "@/features/workspaces/queries";
import JoinWorkspaceForm from "@/features/workspaces/components/join-workspace-form";

import React from "react";

export default async function WorkspaceJoinPage({
  params,
}: {
  params: Promise<{ workspaceId: string; inviteCode: string }>;
}) {
  const { workspaceId } = await params;
  const { data: workspaceName } = await getWorkspaceNameById(workspaceId);

  if (!workspaceName) {
    return <div>Workspace not found</div>;
  }

  return <JoinWorkspaceForm workspaceName={workspaceName} />;
}
