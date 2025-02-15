"use client";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { TaskViewSwitcher } from "@/features/tasks/components/task-view-switcher";
import { Button } from "@/components/ui/button";
import { PencilIcon } from "lucide-react";
import Link from "next/link";
import { useGetSingleProject } from "@/features/projects/api/use-get-single-project";
import { PageLoader } from "@/components/page-loader";
import { PageError } from "@/components/page-error";
import { useGetProjectAnalytics } from "@/features/projects/api/use-get-project-analytics";
import { Analytics } from "@/components/analytics";

export function ProjectPageClient({ projectId }: { projectId: string }) {
  const { data: project, isLoading: isProjectLoading } = useGetSingleProject({
    projectId,
  });
  const { data: analytics, isLoading: isAnalyticsLoading } =
    useGetProjectAnalytics({ projectId });

  const isLoading = isProjectLoading || isAnalyticsLoading;

  if (isLoading) {
    return <PageLoader />;
  }

  if (!project) {
    return <PageError errorMessage="Project not found" />;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ProjectAvatar
            name={project.name}
            imageUrl={project.imageUrl}
            className="size-8 me-0"
          />
          <p className="text-lg font-semibold">{project.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link
              href={`/workspaces/${project.workspaceId}/projects/${projectId}/settings`}
            >
              <PencilIcon className="size-4 mr-2" />
              Edit Project
            </Link>
          </Button>
        </div>
      </div>
      <Analytics data={analytics} />
      <TaskViewSwitcher hideProjectFilter />
    </div>
  );
}
