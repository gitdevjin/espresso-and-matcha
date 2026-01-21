import { createMessage } from "@/actions/create-message";
import { QUERY_KEYS } from "@/lib/const";
import type { Message, MutationCallbacks } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateMessage(callbacks?: MutationCallbacks) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMessage,

    // ─── Optimistic update ───────────────────────────────
    onMutate: async (variables) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.message.byChat });

      // Snapshot previous value
      const previousData = queryClient.getQueryData(QUERY_KEYS.message.byChat);

      // Create optimistic message with TEMPORARY negative ID
      const optimisticMessage: Message = {
        id: -Date.now(), // ← unique negative ID
        content: variables.content,
        authorId: variables.authorId,
        author: { id: variables.authorId, name: "You" }, // or better: get from session
        createdAt: new Date().toISOString(),
        // ... other fields your Message type requires
      };

      // Update cache optimistically (prepend)
      queryClient.setQueryData(QUERY_KEYS.message.byChat, (oldData: any) => {
        if (!oldData) {
          return { pages: [[optimisticMessage]], pageParams: [0] };
        }

        const newPages = [...oldData.pages];
        newPages[0] = [optimisticMessage, ...newPages[0]];

        return { ...oldData, pages: newPages };
      });

      // Return context for rollback
      return { previousData };
    },

    // ─── On success: replace optimistic message with real one ─────
    onSuccess: (newMessage, variables, context) => {
      queryClient.setQueryData(QUERY_KEYS.message.byChat, (oldData: any) => {
        if (!oldData) return oldData;

        const newPages = oldData.pages.map((page: Message[]) =>
          page.map((msg) =>
            // Replace the optimistic message (negative ID) with real one
            msg.id < 0 ? newMessage : msg,
          ),
        );

        return { ...oldData, pages: newPages };
      });

      if (callbacks?.onSuccess) callbacks.onSuccess();
    },

    // ─── Rollback on error ───────────────────────────────
    onError: (error, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          QUERY_KEYS.message.byChat,
          context.previousData,
        );
      }
      if (callbacks?.onError) callbacks.onError(error);
    },
  });
}
