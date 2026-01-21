"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCreateMessage } from "@/hooks/mutations/messages/use-create-message";
import { useInfiniteMessagesQuery } from "@/hooks/queries/use-infinite-message";
import { useSession } from "@/hooks/queries/use-session";

import { useInView } from "react-intersection-observer";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function ChatPage() {
  const {
    data: currentUser,
    isPending: isFetchMePending,
    error: isFetchMeError,
  } = useSession();

  const {
    data,
    error: isFetchMessagesError,
    isPending: isFetchMessagesPending,
    fetchNextPage,
  } = useInfiniteMessagesQuery();

  const [content, setContent] = useState("");
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const firstLoadRef = useRef(true);

  const { mutate: createMessage } = useCreateMessage({
    onSuccess: () => {
      setContent("");
      toast.info("Message Sent", { position: "top-center" });

      // scroll to bottom if user is near bottom
      // chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    },
    onError: (error) => {
      toast.error(error.message, { position: "top-center" });
    },
  });

  // Infinite scroll for older messages
  const { ref: topRef, inView } = useInView();
  useEffect(() => {
    if (inView) fetchNextPage();
  }, [inView]);

  // Scroll to bottom on initial load
  useEffect(() => {
    if (firstLoadRef.current && data) {
      chatEndRef.current?.scrollIntoView({ behavior: "auto" });
      firstLoadRef.current = false;
    }
  }, [data]);

  if (isFetchMePending || isFetchMessagesPending) return <div>Loading...</div>;
  if (isFetchMeError || isFetchMessagesError) return <div>Error</div>;

  const allMessages = data.pages.flat(); // oldest → newest

  return (
    <div className="flex flex-col h-screen max-w-175 mx-auto border-x p-4">
      {/* Current user */}
      <div className="mb-2 text-lg font-semibold text-center">
        Espresso & Matcha
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col-reverse overflow-y-auto space-y-2 px-4">
        {allMessages.map((msg) => {
          const isCurrentUser = msg.author.id === currentUser?.id;
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isCurrentUser ? "items-end" : "items-start"}`}
            >
              {/* Author */}
              <span
                className={`text-sm mb-1 ${
                  isCurrentUser
                    ? "text-right text-accent-foreground"
                    : "text-left text-gray-500"
                }`}
              >
                {msg.author.name}
              </span>

              {/* Message bubble */}
              <Card
                className={`p-2 max-w-[70%] wrap-break-word ${
                  isCurrentUser
                    ? "bg-green-100 text-gray-900 rounded-r-2xl rounded-tl-2xl"
                    : "bg-primary text-white rounded-l-2xl rounded-tr-2xl"
                }`}
              >
                <CardContent className="p-2">{msg.content}</CardContent>
              </Card>
            </div>
          );
        })}
        <div ref={topRef} className="h-1.5" />
        <div ref={chatEndRef} />
      </div>

      {/* Input area */}
      <div className="flex gap-2 mt-2">
        <Input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => {
            if (e.key === "Enter" && content.trim()) {
              createMessage({ authorId: currentUser.id, content });
            }
          }}
        />
        <Button
          onClick={() => createMessage({ authorId: currentUser.id, content })}
        >
          Send
        </Button>
      </div>
    </div>
  );
}
