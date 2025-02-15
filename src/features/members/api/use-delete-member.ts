import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { toast } from "sonner";
type DeleteMemberResponse = InferResponseType<
  (typeof client.api.members)[":memberId"]["$delete"],
  200
>;
type DeleteMemberRequest = InferRequestType<
  (typeof client.api.members)[":memberId"]["$delete"]
>;

export const useDeleteMember = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<
    DeleteMemberResponse,
    Error,
    DeleteMemberRequest
  >({
    mutationFn: async ({ param }) => {
      const response = await client.api.members[":memberId"]["$delete"]({
        param,
      });
      if (!response.ok) {
        throw new Error("Failed to delete member");
      }
      return await response.json();
    },
    onError: (error) => {
      toast.error("Failed to delete member", {
        description: error.message,
      });
      console.error("Delete member error:", error);
    },
    onSuccess: () => {
      toast.success("Member deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
  });

  return mutation;
};
