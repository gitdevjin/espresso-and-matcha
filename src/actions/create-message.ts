export async function createMessage({
  authorId,
  content,
}: {
  authorId: number;
  content: string;
}) {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const res = await fetch("/api/messages", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ content, authorId }),
  });

  if (!res.ok) return null;

  return res.json();
}
