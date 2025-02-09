import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { client } from "@/lib/rpc";
type RegisterResponse = InferResponseType<
  (typeof client.api.auth.register)["$post"]
>;
type RegisterRequest = InferRequestType<
  (typeof client.api.auth.register)["$post"]
>;

export const useRegister = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const mutation = useMutation<RegisterResponse, Error, RegisterRequest>({
    mutationFn: async ({ json }) => {
      const response = await client.api.auth.register.$post({ json });
      if (!response.ok) {
        throw new Error("Register failed");
      }
      return await response.json();
    },
    onError: (error) => {
      toast.error("Register failed");
      console.error("Register error:", error);
    },
    onSuccess: () => {
      toast.success("Register successful");
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
      router.refresh();
    },
  });

  return mutation;
};
