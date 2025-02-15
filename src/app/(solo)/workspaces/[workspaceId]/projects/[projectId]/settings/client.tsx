"use client";

import { PageError } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";
import { useGetSingleProject } from "@/features/projects/api/use-get-single-project";
import { EditProjectForm } from "@/features/projects/components/edit-project-form";

export function SettingsPageClient({ projectId }: { projectId: string }) {
  const { data: project, isLoading } = useGetSingleProject({ projectId });

  if (isLoading) {
    return <PageLoader />;
  }

  if (!project) {
    return <PageError errorMessage="Project not found" />;
  }

  return (
    <div className="w-full lg:max-w-4xl">
      <EditProjectForm initialData={project} />
    </div>
  );
}
