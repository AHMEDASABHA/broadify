import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useRouter } from "next/navigation";

import { client } from "@/lib/rpc";
import { toast } from "sonner";
type UpdateMemberResponse = InferResponseType<
  (typeof client.api.members)[":memberId"]["$patch"],
  200
>;
type UpdateMemberRequest = InferRequestType<
  (typeof client.api.members)[":memberId"]["$patch"]
>;

export const useUpdateMember = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation<
    UpdateMemberResponse,
    Error,
    UpdateMemberRequest
  >({
    mutationFn: async ({ param, json }) => {
      const response = await client.api.members[":memberId"]["$patch"]({
        param,
        json,
      });
      if (!response.ok) {
        throw new Error("Failed to update member");
      }
      return await response.json();
    },
    onError: (error) => {
      toast.error("Failed to update member", {
        description: error.message,
      });
      console.error("Update member error:", error);
    },
    onSuccess: () => {
      toast.success("Member updated successfully");
      queryClient.invalidateQueries({ queryKey: ["members"] });
      router.refresh();
    },
  });

  return mutation;
};
