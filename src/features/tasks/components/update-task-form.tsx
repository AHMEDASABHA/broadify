"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import DottedSeparator from "@/components/dotted-sperator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn, snakeCaseToTitleCase } from "@/lib/utils";
import { createTaskSchema } from "../schema/validation";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

import { DatePicker } from "@/components/ui/date-picker";
import { MembersAvatar } from "@/features/members/components/member-avatar";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { TaskStatus } from "../types/task-status";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import type { Task } from "../types/task";
import { useUpdateTask } from "../api/use-update-task";

interface UpdateTaskFormProps {
  onCancel?: () => void;
  projectOptions: {
    id: string;
    name: string;
    imageUrl: string;
  }[];
  memberOptions: {
    id: string;
    name: string;
  }[];
  initialTaskValues: Task;
}

export function UpdateTaskForm({
  onCancel,
  projectOptions,
  memberOptions,
  initialTaskValues,
}: UpdateTaskFormProps) {
  // const router = useRouter();
  const { mutate: updateTask, isPending } = useUpdateTask();
  const workspaceId = useWorkspaceId();

  const form = useForm<z.infer<typeof createTaskSchema>>({
    resolver: zodResolver(
      createTaskSchema.omit({
        workspaceId: true,
        description: true,
      })
    ),
    defaultValues: {
      ...initialTaskValues,
      dueDate: initialTaskValues.dueDate
        ? new Date(initialTaskValues.dueDate)
        : undefined,
    },
  });

  function onSubmit(data: z.infer<typeof createTaskSchema>) {
    updateTask(
      {
        json: { ...data, workspaceId },
        param: { taskId: initialTaskValues.$id },
      },
      {
        onSuccess: () => {
          onCancel?.();
        },
      }
    );
  }

  return (
    <Card className="w-full h-full flex flex-col border-none shadow-none">
      <CardHeader className="p-7 flex">
        <CardTitle className="text-2xl font-bold">Edit a Task</CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task name </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter task name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Due Date</FormLabel>
                    <DatePicker
                      value={field.value}
                      onChange={field.onChange}
                      className="w-full"
                      isItForm={true}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="assigneeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assignee </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormItem>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an assignee" />
                          </SelectTrigger>
                        </FormControl>
                        <FormMessage />
                        <SelectContent>
                          {memberOptions.map((member) => (
                            <SelectItem key={member.id} value={member.id}>
                              <div className="flex items-center gap-2">
                                <MembersAvatar
                                  className="size-6"
                                  name={member.name}
                                />
                                {member.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </FormItem>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormItem>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a status" />
                          </SelectTrigger>
                        </FormControl>
                        <FormMessage />
                        <SelectContent>
                          {Object.values(TaskStatus).map((status) => (
                            <SelectItem key={status} value={status}>
                              {snakeCaseToTitleCase(status)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </FormItem>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="projectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormItem>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a project" />
                          </SelectTrigger>
                        </FormControl>
                        <FormMessage />
                        <SelectContent>
                          {projectOptions.map((project) => (
                            <SelectItem key={project.id} value={project.id}>
                              <div className="flex items-center gap-2">
                                <ProjectAvatar
                                  className="size-6"
                                  name={project.name}
                                  imageUrl={project.imageUrl}
                                />
                                {project.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </FormItem>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
            <DottedSeparator className="py-7" />
            <div className="flex justify-between items-center">
              <Button
                type="button"
                variant={"outline"}
                onClick={onCancel}
                disabled={isPending}
                className={cn(!onCancel && "invisible")}
              >
                Cancel
              </Button>
              <Button type="submit" size={"lg"} disabled={isPending}>
                {isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
