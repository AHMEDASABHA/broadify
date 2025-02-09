import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useRouter } from "next/navigation";

import { client } from "@/lib/rpc";
import { toast } from "sonner";
type CreateWorkspaceResponse = InferResponseType<
  (typeof client.api.workspaces)[":workspaceId"]["$patch"],
  //I want to get the response type of the successful updated workspace
  200
>;
type CreateWorkspaceRequest = InferRequestType<
  (typeof client.api.workspaces)[":workspaceId"]["$patch"]
>;

export const useUpdateWorkspace = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation<
    CreateWorkspaceResponse,
    Error,
    CreateWorkspaceRequest
  >({
    mutationFn: async ({ form, param }) => {
      const response = await client.api.workspaces[":workspaceId"]["$patch"]({
        form,
        param,
      });
      if (!response.ok) {
        throw new Error("Update workspace failed");
      }
      return await response.json();
    },
    onError: (error) => {
      toast.error("Update workspace failed");
      console.error("Update workspace error:", error);
    },
    onSuccess: ({ data }) => {
      toast.success("Workspace updated successfully");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({
        queryKey: ["workspace", data.$id],
      });
      router.refresh();
    },
  });

  return mutation;
};
