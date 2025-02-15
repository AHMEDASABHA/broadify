import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { toast } from "sonner";
type ResetInviteCodeResponse = InferResponseType<
  (typeof client.api.workspaces)[":workspaceId"]["reset-invite-code"]["$post"],
  200
>;
type ResetInviteCodeRequest = InferRequestType<
  (typeof client.api.workspaces)[":workspaceId"]["reset-invite-code"]["$post"]
>;

export const useResetInviteCode = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<
    ResetInviteCodeResponse,
    Error,
    ResetInviteCodeRequest
  >({
    mutationFn: async ({ param }) => {
      const response = await client.api.workspaces[":workspaceId"][
        "reset-invite-code"
      ]["$post"]({
        param,
      });
      if (!response.ok) {
        throw new Error("Failed to reset invite code");
      }
      return await response.json();
    },
    onError: (error) => {
      toast.error("Failed to reset invite code");
      console.error("Reset invite code error:", error);
    },
    onSuccess: ({ data }) => {
      toast.success("Invite code reset successfully");
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({
        queryKey: ["workspace", data.$id],
      });
    },
  });

  return mutation;
};
