"use client";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { TaskViewSwitcher } from "@/features/tasks/components/task-view-switcher";
import { Button } from "@/components/ui/button";
import { PencilIcon } from "lucide-react";
import Link from "next/link";
import { useGetSingleProject } from "@/features/projects/api/use-get-single-project";
import { PageLoader } from "@/components/page-loader";
import {PageError} from "@/components/page-error";
export function ProjectPageClient({ projectId }: { projectId: string }) {
  const { data: intialValues, isLoading } = useGetSingleProject({ projectId });

  if (isLoading) {
    return <PageLoader />;
  }

  if (!intialValues) {
    return <PageError errorMessage="Project not found" />;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ProjectAvatar
            name={intialValues.name}
            imageUrl={intialValues.imageUrl}
            className="size-8 me-0"
          />
          <p className="text-lg font-semibold">{intialValues.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link
              href={`/workspaces/${intialValues.workspaceId}/projects/${projectId}/settings`}
            >
              <PencilIcon className="size-4 mr-2" />
              Edit Project
            </Link>
          </Button>
        </div>
      </div>
      <TaskViewSwitcher hideProjectFilter />
    </div>
  );
}
