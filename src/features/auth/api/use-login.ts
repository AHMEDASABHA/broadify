import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { client } from "@/lib/rpc";

type LoginResponse = InferResponseType<(typeof client.api.auth.login)["$post"]>;
type LoginRequest = InferRequestType<(typeof client.api.auth.login)["$post"]>;

export const useLogin = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: async ({ json }) => {
      const response = await client.api.auth.login.$post({ json });
      if (!response.ok) {
        throw new Error("Login failed");
      }
      return await response.json();
    },
    onError: (error) => {
      toast.error("Login failed");
      console.error("Login error:", error);
    },
    onSuccess: () => {
      toast.success("Login successful");
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
      router.refresh();
    },
  });

  return mutation;
};
