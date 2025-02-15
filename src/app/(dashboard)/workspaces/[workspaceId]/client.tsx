"use client";

import { Analytics } from "@/components/analytics";
import DottedSeparator from "@/components/dotted-sperator";
import { PageError } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";
import { Button } from "@/components/ui/button";

import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useCreateProjectModel } from "@/features/projects/hooks/use-create-project-model";
import { useGetTasks } from "@/features/tasks/api/use-get-tasks";
import { useCreateTaskModel } from "@/features/tasks/hooks/use-create-task-model";
import type { Task } from "@/features/tasks/types/task";
import { useGetWorkspaceAnalytics } from "@/features/workspaces/api/use-get-workspace-analytics";

import Link from "next/link";

import { CalendarIcon, SettingsIcon, PlusIcon } from "lucide-react";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import type { Project } from "@/features/projects/types/project";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import type { Member } from "@/features/members/types/member";
import { MembersAvatar } from "@/features/members/components/member-avatar";
export function SingleWorkspaceClient({
  workspaceId,
}: {
  workspaceId: string;
}) {
  const { data: analyticsData, isLoading: isLoadingAnalytics } =
    useGetWorkspaceAnalytics({ workspaceId });
  const { data: tasksData, isLoading: isLoadingTasks } = useGetTasks({
    workspaceId,
  });
  const { data: projectsData, isLoading: isLoadingProjects } = useGetProjects({
    workspaceId,
  });
  const { data: membersData, isLoading: isLoadingMembers } = useGetMembers({
    workspaceId,
  });

  const isLoading =
    isLoadingAnalytics ||
    isLoadingTasks ||
    isLoadingProjects ||
    isLoadingMembers;

  if (isLoading) {
    return <PageLoader />;
  }
  if (!analyticsData || !tasksData || !projectsData || !membersData) {
    return <PageError errorMessage="Failed to load workspace data" />;
  }
  return (
    <div className="h-full flex flex-col gap-4">
      <Analytics data={analyticsData} />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <TaskList data={tasksData.documents} total={tasksData.total} />
        <ProjectList
          data={projectsData.documents as Project[]}
          total={projectsData.total}
        />
        <MembersList data={membersData.documents} total={membersData.total} />
      </div>
    </div>
  );
}

interface TaskListProps {
  data: Task[];
  total: number;
}

function TaskList({ data, total }: TaskListProps) {
  const workspaceId = useWorkspaceId();
  const { open: createTask } = useCreateTaskModel();

  return (
    <div className="flex flex-col gap-4 col-span-1">
      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Tasks ({total})</p>
          <Button
            variant="secondary"
            size="icon"
            onClick={() => createTask(null)}
          >
            <PlusIcon className="w-4 h-4 text-neutral-400" />
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <ul className="flex flex-col gap-2">
          {data.map((task) => (
            <li key={task.$id}>
              <Link href={`/workspaces/${workspaceId}/tasks/${task.$id}`}>
                <Card className="shadow-none rounded-lg hover:opacity-75 transition">
                  <CardContent className="p-4">
                    <p className="text-lg font-medium truncate">{task.title}</p>
                    <div className="flex items-center gap-2">
                      <p>{task.project?.name}</p>
                      <div className="size-1 rounded-full bg-neutral-300" />
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <CalendarIcon className="size-3 mr-1" />
                        <span className="truncate">
                          {formatDistanceToNow(new Date(task.dueDate))}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
          <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
            No task found
          </li>
        </ul>
        <Button variant="secondary" size="lg" className="w-full mt-4" asChild>
          <Link href={`/workspaces/${workspaceId}/tasks`}>Show All</Link>
        </Button>
      </div>
    </div>
  );
}

interface ProjectListProps {
  data: Project[];
  total: number;
}

function ProjectList({ data, total }: ProjectListProps) {
  const workspaceId = useWorkspaceId();
  const { open: createProject } = useCreateProjectModel();

  return (
    <div className="flex flex-col gap-4 col-span-1">
      <div className="bg-white border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Projects ({total})</p>
          <Button variant="outline" size="icon" onClick={createProject}>
            <PlusIcon className="w-4 h-4 text-neutral-400" />
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {data.map((project) => (
            <li key={project.$id}>
              <Link href={`/workspaces/${workspaceId}/projects/${project.$id}`}>
                <Card className="shadow-none rounded-lg hover:opacity-75 transition">
                  <CardContent className="p-4 flex items-center gap-2.5">
                    <ProjectAvatar
                      name={project.name}
                      imageUrl={project.imageUrl}
                      className="size-12"
                      fallbackClassName="text-lg"
                    />
                    <p className="text-lg font-medium truncate">
                      {project.name}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
          <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
            No project found
          </li>
        </ul>
      </div>
    </div>
  );
}

interface MemberListProps {
  data: Member[];
  total: number;
}

function MembersList({ data, total }: MemberListProps) {
  const workspaceId = useWorkspaceId();

  return (
    <div className="flex flex-col gap-4 col-span-1">
      <div className="bg-white border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Members ({total})</p>
          <Button variant="outline" size="icon" asChild>
            <Link href={`/workspaces/${workspaceId}/settings`}>
              <SettingsIcon className="w-4 h-4 text-neutral-400" />
            </Link>
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((member) => (
            <li key={member.$id}>
              <Card className="shadow-none rounded-lg overflow-hidden">
                <CardContent className="p-3 flex flex-colitems-center gap-2">
                  <MembersAvatar
                    name={member.name}
                    className="size-12"
                    fallbackClassName="text-lg"
                  />
                  <div className="flex flex-col items-center overflow-hidden">
                    <p className="text-lg font-medium line-clamp-1">
                      {member.name}
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {member.email}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
          <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
            No members found
          </li>
        </ul>
      </div>
    </div>
  );
}
