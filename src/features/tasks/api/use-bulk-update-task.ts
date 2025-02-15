import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { toast } from "sonner";
type UpdateTaskResponse = InferResponseType<
  (typeof client.api.tasks)["bulk-update"]["$post"],
  //I want to get the response type of the successful updated workspace
  200
>;
type UpdateTaskRequest = InferRequestType<
  (typeof client.api.tasks)["bulk-update"]["$post"]
>;

export const useBulkUpdateTask = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<UpdateTaskResponse, Error, UpdateTaskRequest>({
    mutationFn: async ({ json }) => {
      const response = await client.api.tasks["bulk-update"]["$post"]({
        json,
      });
      if (!response.ok) {
        throw new Error("Updating tasks failed");
      }
      return await response.json();
    },
    onError: (error) => {
      toast.error("Updating tasks failed", {
        description: error.message,
      });
      console.error("Updating tasks error:", error);
    },
    onSuccess: () => {
      toast.success("Tasks updated successfully");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["project-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["workspace-analytics"] });
    },
  });

  return mutation;
};
