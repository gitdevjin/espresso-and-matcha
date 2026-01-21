"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/types";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    // 🔒 Not logged in → redirect immediately
    if (!token) {
      router.replace("/auth/login");
      return;
    }

    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          localStorage.removeItem("token");
          router.replace("/auth/login");
          return;
        }

        if (!res.ok) {
          throw new Error("Failed to fetch users");
        }

        const data: User[] = await res.json();
        setUsers(data);
      } catch (err) {
        setError("Could not load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [router]);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="flex min-h-screen items-center justify-center gap-6 p-6 font-sans">
      <Button onClick={() => router.push("/chats")}>Go To Chat</Button>
    </div>
  );
}
