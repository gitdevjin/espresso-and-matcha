import { fetchMe } from "@/actions/fetch-me";
import { QUERY_KEYS } from "@/lib/const";
import { User } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useSession() {
  return useQuery({
    queryKey: QUERY_KEYS.user.me,
    queryFn: async () => {
      const user: User = await fetchMe(); // returns User | null
      return user;
    },
    staleTime: 60 * 5 * 1000,
    retry: false,
  });
}
