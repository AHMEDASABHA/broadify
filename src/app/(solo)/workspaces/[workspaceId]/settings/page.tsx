import React from "react";
import { EditWorkspaceForm } from "@/features/workspaces/components/edit-workspace-form";
import { getWorkspaceById } from "@/features/workspaces/queries";
import { redirect } from "next/navigation";
interface SingleWorkspaceSettingsPageProps {
  params: Promise<{
    workspaceId: string;
  }>;
}

export default async function SingleWorkspaceSettingsPage({
  params,
}: SingleWorkspaceSettingsPageProps) {
  const { workspaceId } = await params;
  const { data: workspace } = await getWorkspaceById(workspaceId);
  if (!workspace) {
    redirect(`/workspaces/${workspaceId}`);
  }
  return (
    <div className="w-full lg:max-w-4xl">
      <EditWorkspaceForm initialData={workspace} />
    </div>
  );
}
