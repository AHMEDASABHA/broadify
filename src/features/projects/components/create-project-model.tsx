"use client";
import { ResponsiveModel } from "@/components/dashboard/responsive-model";
import { CreateProjectForm } from "./create-project-form";
import { useCreateProjectModel } from "../hooks/use-create-project-model";
export function CreateProjectModel() {
  const { isOpen, setIsOpen, close } = useCreateProjectModel();

  return (
    <ResponsiveModel
      open={isOpen}
      onOpenChange={setIsOpen}
      title="Create Project"
      description="Create a new project to start managing your tasks"
    >
      <CreateProjectForm onCancel={close} />
    </ResponsiveModel>
  );
}
