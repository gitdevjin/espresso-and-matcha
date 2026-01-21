import { fetchMessages } from "@/actions/fetch-messages";
import { QUERY_KEYS } from "@/lib/const";
import { Message } from "@/types";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";

const PAGE_SIZE = 10;

export function useInfiniteMessagesQuery() {
  const queryClient = useQueryClient();

  return useInfiniteQuery({
    queryKey: QUERY_KEYS.message.byChat,
    queryFn: async ({ pageParam }) => {
      const take = PAGE_SIZE;
      const skip = pageParam * PAGE_SIZE;

      const messages: Message[] =
        (await fetchMessages({
          from: skip,
          to: skip + take - 1,
        })) || [];

      return messages;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < PAGE_SIZE) return undefined;
      return allPages.length; // or allPages.flat().length
    },
    staleTime: Infinity,
    refetchInterval: 3000,
  });
}
