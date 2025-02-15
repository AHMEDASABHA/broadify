import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { toast } from "sonner";
type DeleteTaskResponse = InferResponseType<
  (typeof client.api.tasks)[":taskId"]["$delete"],
  200
>;
type DeleteTaskRequest = InferRequestType<
  (typeof client.api.tasks)[":taskId"]["$delete"]
>;

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<DeleteTaskResponse, Error, DeleteTaskRequest>({
    mutationFn: async ({ param }) => {
      const response = await client.api.tasks[":taskId"]["$delete"]({
        param,
      });
      if (!response.ok) {
        throw new Error("Failed to delete task");
      }
      return await response.json();
    },
    onError: (error) => {
      toast.error("Failed to delete task");
      console.error("Delete task error:", error);
    },
    onSuccess: ({ data }) => {
      toast.success("Task deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({
        queryKey: ["task", data.id],
      });
    },
  });

  return mutation;
};
