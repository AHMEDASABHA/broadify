"use client";
import { EditWorkspaceForm } from "@/features/workspaces/components/edit-workspace-form";
import { PageError } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";
import { useGetSingleWorkspace } from "@/features/workspaces/api/use-get-single-workspace";
export function WorkspaceSettingsPageClient({
  workspaceId,
}: {
  workspaceId: string;
}) {
  const { data: workspace, isLoading } = useGetSingleWorkspace({ workspaceId });

  if (isLoading) {
    return <PageLoader />;
  }

  if (!workspace) {
    return <PageError errorMessage="Workspace not found" />;
  }
  return (
    <div className="w-full lg:max-w-4xl">
      <EditWorkspaceForm initialData={workspace} />
    </div>
  );
}
