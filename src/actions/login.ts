"use server";
import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function login(name: string, password: string) {
  const user = await prisma.user.findUnique({ where: { name } });

  if (!user) throw new Error("Wrong Name or Password");

  const isValid = user.password === password;
  if (!isValid) throw new Error("Wrong Name or Password");

  // Create JWT
  const token = jwt.sign({ userId: user.id, name: user.name }, JWT_SECRET, {
    expiresIn: "7d",
  });

  return { token, user };
}
