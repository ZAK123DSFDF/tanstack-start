// hooks/useAppMutation.ts
import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { EdenResponse } from "@/lib/eden/types";

/**
 * We create a helper type that ensures the hook can see our
 * custom fields (toast, message, etc) regardless of the Success/Error state.
 */
type EdenMutationResult = EdenResponse<any> & {
  toast?: string | null;
  message?: string;
  redirectUrl?: string;
};

export function useAppMutation<TData extends EdenMutationResult, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: Omit<
    UseMutationOptions<TData, Error, TVariables>,
    "mutationFn" | "onSuccess" | "onError"
  > & {
    disableSuccessToast?: boolean;
    disableErrorToast?: boolean;
    redirectUrl?: string;
    onSuccess?: (data: TData, variables: TVariables, context: unknown) => void;
    onError?: (error: Error, variables: TVariables, context: unknown) => void;
    onSettled?: (
      data: TData | undefined,
      error: Error | null,
      variables: TVariables,
      context: unknown,
    ) => void;
  },
) {
  const navigate = useNavigate();

  return useMutation<TData, Error, TVariables>({
    mutationFn: async (variables) => {
      const res = await mutationFn(variables);

      // 🟢 Logic: If ok is false, it's an EdenError
      if (!res.ok) {
        // res is now narrowed to EdenError
        const errorMessage =
          res.toast || res.message || res.error || "Action failed";
        throw new Error(errorMessage);
      }

      return res;
    },
    ...options,

    onSuccess: (res, variables, context) => {
      // ✅ res is narrowed to the Success side of the union here
      if (!options?.disableSuccessToast) {
        toast.success("Success", {
          description: res.toast || res.message || "Action completed.",
        });
      }

      const rUrl = res.redirectUrl || options?.redirectUrl;
      if (rUrl) {
        navigate({ to: rUrl as any });
      }

      options?.onSuccess?.(res, variables, context);
    },

    onError: (err, variables, context) => {
      if (!options?.disableErrorToast) {
        toast.error("Error", {
          description: err.message || "Something went wrong.",
        });
      }
      options?.onError?.(err, variables, context);
    },
  });
}
