export async function fetchMessages({
  from,
  to,
}: {
  from: number;
  to: number;
}) {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const res = await fetch(`/api/messages?from=${from}&to=${to}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) return null;

  return res.json(); // Messages[]
}
