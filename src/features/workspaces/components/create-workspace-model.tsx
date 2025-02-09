"use client";
import { ResponsiveModel } from "@/components/dashboard/responsive-model";
import { CreateWorkspaceForm } from "./create-workspace-form";
import { useCreateWorkspaceModel } from "../hooks/use-create-workspace-model";

export function CreateWorkspaceModel() {
  const { isOpen, setIsOpen, close } = useCreateWorkspaceModel();

  return (
    <ResponsiveModel
      open={isOpen}
      onOpenChange={setIsOpen}
      title="Create Workspace"
      description="Create a new workspace to start managing your projects and tasks"
    >
      <CreateWorkspaceForm onCancel={close} />
    </ResponsiveModel>
  );
}
