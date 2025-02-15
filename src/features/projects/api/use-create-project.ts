import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { toast } from "sonner";
type CreateProjectResponse = InferResponseType<
  (typeof client.api.projects)["$post"],
  200
>;
type CreateProjectRequest = InferRequestType<
  (typeof client.api.projects)["$post"]
>;

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    CreateProjectResponse,
    Error,
    CreateProjectRequest
  >({
    mutationFn: async ({ form }) => {
      const response = await client.api.projects.$post({ form });
      if (!response.ok) {
        throw new Error("Create project failed");
      }
      return await response.json();
    },
    onError: (error) => {
      toast.error("Create project failed");
      console.error("Create project error:", error);
    },
    onSuccess: () => {
      toast.success("Project created successfully");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  return mutation;
};
