"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageIcon, ArrowLeftIcon } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import DottedSeparator from "@/components/dotted-sperator";

import { useRef, type ChangeEvent } from "react";
import { useConfirm } from "@/hooks/use-confirm";
import { cn } from "@/lib/utils";
import { updateProjectSchema } from "../schema/validation";
import { useUpdateProject } from "../api/use-update-project";
import { useDeleteProject } from "../api/use-delete-project";
import { Project } from "../types/project";

interface EditProjectFormProps {
  onCancel?: () => void;
  initialData: Project;
}

export function EditProjectForm({
  onCancel,
  initialData,
}: EditProjectFormProps) {
  const router = useRouter();
  const { mutate: updateProject, isPending } = useUpdateProject();
  const { mutate: deleteProject, isPending: isDeleting } = useDeleteProject();

  const [DeleteDialog, confirmDelete] = useConfirm(
    "Delete project",
    "Are you sure you want to delete this project? This action is irreversible.",
    "destructive"
  );

  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof updateProjectSchema>>({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: {
      ...initialData,
      image: initialData.imageUrl ?? "",
    },
  });

  function onSubmit(data: z.infer<typeof updateProjectSchema>) {
    const finalData = {
      ...data,
      image: data.image instanceof File ? data.image : "",
    };
    updateProject({ form: finalData, param: { projectId: initialData.$id } });
  }

  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);
    }
  }

  async function handleDeleteWorkspace() {
    const ok = await confirmDelete();
    if (!ok) {
      return;
    }
    deleteProject(
      { param: { projectId: initialData.$id } },
      {
        onSuccess: () => {
          router.push(`/workspaces/${initialData.workspaceId}`);
        },
      }
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <DeleteDialog />
      <Card className="w-full h-full flex flex-col border-none shadow-none">
        <CardHeader className="flex flex-row items-center gap-4 p-7 space-y-0">
          <Button
            variant={"outline"}
            size={"sm"}
            onClick={
              onCancel
                ? onCancel
                : () =>
                    router.replace(
                      `/workspaces/${initialData.workspaceId}/projects/${initialData.$id}`
                    )
            }
          >
            <ArrowLeftIcon className="size-4 mr-2" />
            Back
          </Button>
          <CardTitle className="text-2xl font-bold">
            Edit project {initialData.name}
          </CardTitle>
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
                      <FormLabel>Project name </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter project name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-5">
                        {field.value ? (
                          <div className="w-20 h-20 relative rounded-md overflow-hidden">
                            <Image
                              src={
                                field.value instanceof File
                                  ? URL.createObjectURL(field.value)
                                  : field.value
                              }
                              alt="Project image"
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <Avatar className="w-20 h-20">
                            <AvatarFallback>
                              <ImageIcon className="w-10 h-10 text-neutral-400" />
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className="flex flex-col gap-1">
                          <p className="text-sm font-medium">Project Icon</p>
                          <p className="text-xs text-neutral-500">
                            PNG, JPG, JPEG, SVG up to 5MB
                          </p>
                          <Input
                            type="file"
                            ref={inputRef}
                            accept=".png, .jpg, .jpeg, .svg"
                            onChange={handleImageChange}
                            className="hidden"
                            disabled={isPending}
                          />
                          {field.value ? (
                            <Button
                              type="button"
                              variant="destructive"
                              size={"sm"}
                              onClick={() => {
                                field.onChange(null);
                                form.setValue("image", "");
                                if (inputRef.current) {
                                  inputRef.current.value = "";
                                }
                              }}
                              className="w-fit mt-2"
                              disabled={isPending}
                            >
                              Remove Image
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              variant="outline"
                              size={"sm"}
                              onClick={() => inputRef.current?.click()}
                              className="w-fit mt-2"
                              disabled={isPending}
                            >
                              Upload Image
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
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
                  {isPending ? "Saving..." : "Save changes"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card className="w-full h-full border-none shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-bold">Danger Zone</h3>
            <p className="text-sm text-neutral-500">
              Deleting this project will remove all tasks and files associated
              with it. This action is irreversible.
            </p>
            <Button
              variant={"destructive"}
              disabled={isDeleting || isPending}
              size={"lg"}
              className="w-fit mt-6 ml-auto"
              onClick={handleDeleteWorkspace}
            >
              {isDeleting ? "Deleting..." : "Delete project"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
