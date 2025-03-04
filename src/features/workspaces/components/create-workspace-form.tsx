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

import { createWorkspaceSchema } from "../schema/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import DottedSeparator from "@/components/dotted-sperator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateWorkspace } from "../api/use-create-workspace";
import { useRef, type ChangeEvent } from "react";
import { ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface CreateWorkspaceFormProps {
  onCancel?: () => void;
}

export function CreateWorkspaceForm({ onCancel }: CreateWorkspaceFormProps) {
  const router = useRouter();
  const { mutate: createWorkspace, isPending } = useCreateWorkspace();

  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof createWorkspaceSchema>>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: "",
    },
  });

  function onSubmit(data: z.infer<typeof createWorkspaceSchema>) {
    const finalData = {
      ...data,
      image: data.image instanceof File ? data.image : "",
    };
    createWorkspace(
      { form: finalData },
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

  return (
    <Card className="w-full h-full flex flex-col border-none shadow-none">
      <CardHeader className="p-7 flex">
        <CardTitle className="text-2xl font-bold">
          Create a new workspace
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
                {isPending ? "Creating..." : "Create Workspace"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
