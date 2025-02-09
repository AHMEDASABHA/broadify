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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";

import { updateWorkspaceSchema } from "../schema/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import DottedSeparator from "@/components/dotted-sperator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRef, type ChangeEvent } from "react";
import { ImageIcon, ArrowLeftIcon, CopyIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useUpdateWorkspace } from "../api/use-update-workspace";
import { Workspace } from "../types/workspace";
import { useDeleteWorkspace } from "../api/use-delete-workspace";
import { useConfirm } from "@/hooks/use-confirm";
import { toast } from "sonner";
import { useResetInviteCode } from "../api/use-rest-invite-code";
interface EditWorkspaceFormProps {
  onCancel?: () => void;
  initialData: Workspace;
}

export function EditWorkspaceForm({
  onCancel,
  initialData,
}: EditWorkspaceFormProps) {
  const router = useRouter();
  const { mutate: updateWorkspace, isPending } = useUpdateWorkspace();
  const { mutate: deleteWorkspace, isPending: isDeleting } =
    useDeleteWorkspace();
  const { mutate: resetInviteCode, isPending: isResettingInviteCode } =
    useResetInviteCode();

  const [DeleteDialog, confirmDelete] = useConfirm(
    "Delete workspace",
    "Are you sure you want to delete this workspace? This action is irreversible.",
    "destructive"
  );

  const [ResetInviteCodeDialog, confirmResetInviteCode] = useConfirm(
    "Reset invite code",
    "Are you sure you want to reset the invite code? This link will be invalidated.",
    "destructive"
  );

  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof updateWorkspaceSchema>>({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: {
      ...initialData,
      image: initialData.imageUrl ?? "",
    },
  });

  function onSubmit(data: z.infer<typeof updateWorkspaceSchema>) {
    const finalData = {
      ...data,
      image: data.image instanceof File ? data.image : "",
    };
    updateWorkspace(
      { form: finalData, param: { workspaceId: initialData.$id } },
      {
        onSuccess: ({ data }) => {
          form.reset();
          router.replace(`/workspaces/${data.$id}`);
        },
      }
    );
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
    deleteWorkspace(
      { param: { workspaceId: initialData.$id } },
      {
        onSuccess: () => {
          router.push("/");
        },
      }
    );
  }

  const fullInviteCode = `${window.location.origin}/workspaces/${initialData.$id}/join/${initialData.inviteCode}`;

  async function handleCopyInviteCode() {
    await navigator.clipboard.writeText(fullInviteCode);
    toast.success("Invite code copied to clipboard");
  }

  async function handleResetInviteCode() {
    const ok = await confirmResetInviteCode();
    if (!ok) {
      return;
    }
    resetInviteCode(
      { param: { workspaceId: initialData.$id } },
      {
        onSuccess: () => {
          
        },
      }
    );
  }
  return (
    <div className="flex flex-col gap-4">
      <ResetInviteCodeDialog />
      <DeleteDialog />
      <Card className="w-full h-full flex flex-col border-none shadow-none">
        <CardHeader className="flex flex-row items-center gap-4 p-7 space-y-0">
          <Button
            variant={"outline"}
            size={"sm"}
            onClick={
              onCancel
                ? onCancel
                : () => router.replace(`/workspaces/${initialData.$id}`)
            }
          >
            <ArrowLeftIcon className="size-4 mr-2" />
            Back
          </Button>
          <CardTitle className="text-2xl font-bold">
            Edit workspace {initialData.name}
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
                      <FormLabel>Workspace name </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter workspace name" />
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
                              alt="Workspace image"
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
                          <p className="text-sm font-medium">Workspace Icon</p>
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
            <h3 className="text-lg font-bold">Invite Members</h3>
            <p className="text-sm text-neutral-500">
              Share the invite link with your team to add members to your
              workspace
            </p>
            <div className="flex items-center gap-2 mt-4">
              <Input type="text" value={fullInviteCode} disabled />
              <Button
                variant={"outline"}
                disabled={isDeleting || isPending}
                size={"lg"}
                className="size-11"
                onClick={handleCopyInviteCode}
              >
                <CopyIcon className="size-5" />
              </Button>
            </div>

            <p className="text-sm text-neutral-500">
              This action cannot be undone.
            </p>
            <Button
              variant={"destructive"}
              disabled={isResettingInviteCode || isPending}
              size={"lg"}
              className="w-fit mt-6 ml-auto"
              onClick={handleResetInviteCode}
            >
              {isResettingInviteCode ? "Resetting..." : "Reset invite code"}
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card className="w-full h-full border-none shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col gap-4">
            <h3 className="text-lg font-bold">Danger Zone</h3>
            <p className="text-sm text-neutral-500">
              Deleting this workspace will remove all projects, tasks, and files
              associated with it. This action is irreversible.
            </p>
            <Button
              variant={"destructive"}
              disabled={isDeleting || isPending}
              size={"lg"}
              className="w-fit mt-6 ml-auto"
              onClick={handleDeleteWorkspace}
            >
              {isDeleting ? "Deleting..." : "Delete workspace"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
