"use client";
import { useSession } from "@/hooks/queries/use-session";
import { ReactNode } from "react";

export default function SessionProvider({ children }: { children: ReactNode }) {
  const { data: user, isPending, error } = useSession();

  if (isPending) return <div>loading...</div>;

  return <>{children}</>;
}
