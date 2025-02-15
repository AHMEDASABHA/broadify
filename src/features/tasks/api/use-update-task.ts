import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { toast } from "sonner";
type UpdateTaskResponse = InferResponseType<
  (typeof client.api.tasks)[":taskId"]["$patch"],
  //I want to get the response type of the successful updated workspace
  200
>;
type UpdateTaskRequest = InferRequestType<
  (typeof client.api.tasks)[":taskId"]["$patch"]
>;

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<UpdateTaskResponse, Error, UpdateTaskRequest>({
    mutationFn: async ({ json, param }) => {
      const response = await client.api.tasks[":taskId"]["$patch"]({
        json,
        param,
      });
      if (!response.ok) {
        throw new Error("Update task failed");
      }
      return await response.json();
    },
    onError: (error) => {
      toast.error("Update task failed", {
        description: error.message,
      });
      console.error("Update task error:", error);
    },
    onSuccess: ({ data }) => {
      toast.success("Task updated successfully");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({
        queryKey: ["task", data.$id],
      });
      queryClient.invalidateQueries({ queryKey: ["project-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["workspace-analytics"] });
    },
  });

  return mutation;
};
