import React, { useState } from "react";
import { Task } from "../types/task";
import { Button } from "@/components/ui/button";
import { PencilIcon, Loader2, XIcon } from "lucide-react";
import DottedSeparator from "@/components/dotted-sperator";
import { useUpdateTask } from "../api/use-update-task";
import { Textarea } from "@/components/ui/textarea";
interface TaskDescriptionProps {
  task: Task;
}
export default function TaskDescription({ task }: TaskDescriptionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(task.description);

  const { mutate: updateTask, isPending } = useUpdateTask();

  function handleSave() {
    updateTask(
      {
        param: {
          taskId: task.$id,
        },
        json: {
          description: description,
        },
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      }
    );
  }

  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold">Description</p>
        <Button
          onClick={() => setIsEditing((prev) => !prev)}
          variant="outline"
          size="sm"
        >
          {isEditing ? (
            isPending ? (
              <Loader2 className="size-4 mr-2 animate-spin" />
            ) : (
              <XIcon className="size-4 mr-2" />
            )
          ) : (
            <PencilIcon className="size-4 mr-2" />
          )}
          {isEditing ? "Save" : "Edit"}
        </Button>
      </div>
      <DottedSeparator className="my-4" />
      {isEditing ? (
        <div className="flex flex-col gap-4">
          <Textarea
            placeholder="Add a description..."
            value={description}
            rows={4}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isPending}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            disabled={isPending}
            className="w-fit ml-auto"
          >
            {isPending ? (
              <Loader2 className="size-4 mr-2 animate-spin" />
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      ) : (
        <div>
          {task.description || (
            <p className="text-sm text-muted-foreground">
              No description set up for this task.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
