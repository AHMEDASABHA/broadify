import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { toast } from "sonner";
type UpdateProjectResponse = InferResponseType<
  (typeof client.api.projects)[":projectId"]["$patch"],
  //I want to get the response type of the successful updated workspace
  200
>;
type UpdateProjectRequest = InferRequestType<
  (typeof client.api.projects)[":projectId"]["$patch"]
>;

export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    UpdateProjectResponse,
    Error,
    UpdateProjectRequest
  >({
    mutationFn: async ({ form, param }) => {
      const response = await client.api.projects[":projectId"]["$patch"]({
        form,
        param,
      });
      if (!response.ok) {
        throw new Error("Update project failed");
      }
      return await response.json();
    },
    onError: (error) => {
      toast.error("Update project failed", {
        description: error.message,
      });
      console.error("Update project error:", error);
    },
    onSuccess: ({ data }) => {
      toast.success("Project updated successfully");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({
        queryKey: ["project", data.$id],
      });
    },
  });

  return mutation;
};
