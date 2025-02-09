import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useRouter } from "next/navigation";

import { client } from "@/lib/rpc";
import { toast } from "sonner";
type CreateWorkspaceResponse = InferResponseType<
  (typeof client.api.workspaces)["$post"]
>;
type CreateWorkspaceRequest = InferRequestType<
  (typeof client.api.workspaces)["$post"]
>;

export const useCreateWorkspace = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation<
    CreateWorkspaceResponse,
    Error,
    CreateWorkspaceRequest
  >({
    mutationFn: async ({ form }) => {
      const response = await client.api.workspaces.$post({ form });
      if (!response.ok) {
        throw new Error("Create workspace failed");
      }
      return await response.json();
    },
    onError: (error) => {
      toast.error("Create workspace failed");
      console.error("Create workspace error:", error);
    },
    onSuccess: () => {
      toast.success("Workspace created successfully");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      router.refresh();
    },
  });

  return mutation;
};
