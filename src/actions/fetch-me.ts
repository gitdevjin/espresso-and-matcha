export async function fetchMe() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const res = await fetch("/api/me", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) return null;

  return res.json(); // User
}
