"use client";
import { login } from "@/actions/login";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Coffee } from "lucide-react";
import { useState } from "react";

export default function LoginForm() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    try {
      const { token } = await login(name, password);
      localStorage.setItem("token", token);
      window.location.href = "/chats";
    } catch (err) {
      console.error("Login failed", err);
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coffee className="text-primary" />
          Login
        </CardTitle>
        <CardDescription>Enter your Name and Password</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="not your real name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
      </CardContent>

      <CardFooter />
    </Card>
  );
}
