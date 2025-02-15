import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { toast } from "sonner";
type CreateTaskResponse = InferResponseType<
  (typeof client.api.tasks)["$post"],
  200
>;
type CreateTaskRequest = InferRequestType<(typeof client.api.tasks)["$post"]>;

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<CreateTaskResponse, Error, CreateTaskRequest>({
    mutationFn: async ({ json }) => {
      const response = await client.api.tasks.$post({ json });
      if (!response.ok) {
        throw new Error("Create task failed");
      }
      return await response.json();
    },
    onError: (error) => {
      toast.error("Create task failed");
      console.error("Create task error:", error);
    },
    onSuccess: () => {
      toast.success("Task created successfully");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["project-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["workspace-analytics"] });
    },
  });

  return mutation;
};
