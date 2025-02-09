import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { client } from "@/lib/rpc";

type LogoutResponse = InferResponseType<
  (typeof client.api.auth.logout)["$post"]
>;

export const useLogout = () => {
  const router = useRouter();

  const queryClient = useQueryClient();
  const mutation = useMutation<LogoutResponse, Error>({
    mutationFn: async () => {
      const response = await client.api.auth.logout.$post();
      if (!response.ok) {
        throw new Error("Logout failed");
      }
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Logout successful");
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      router.refresh();
    },
    onError: (error) => {
      toast.error("Logout failed");
      console.error(error);
    },
  });

  return mutation;
};
