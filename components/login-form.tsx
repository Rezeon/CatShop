"use client";

import { GalleryVerticalEnd } from "lucide-react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/hooks/trpc";
import toast from "react-hot-toast";
import Link from "next/link";
interface LoginFormProps {
  className?: string;
}

export function LoginForm({ className }: LoginFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const registerUser = trpc.auth.login.useMutation({
    onSuccess: () => {
      toast.dismiss();
      toast.success("Berhasil Login");
      router.push("/");
    },
    onError: (err: any) => {
      toast.dismiss();
      toast.error("Gagal: " + err.message);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    toast.loading("Loading...");
    registerUser.mutate(form);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-md">
              <GalleryVerticalEnd className="size-6" />
            </div>
            <h1 className="text-xl font-bold">Login to ShopCat Inc.</h1>
          </div>
          <div className="grid gap-3">
            <Label htmlFor="email" className="text-sm">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              required
              className="w-full"
              value={form.email}
              onChange={(e: any) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="password" className="text-sm">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              required
              className="w-full"
              value={form.password}
              onChange={(e: any) =>
                setForm({ ...form, password: e.target.value })
              }
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
            variant="default"
            size="default"
          >
            {loading ? "Login..." : "Login"}
          </Button>
        </div>
      </form>

      <div className="text-xs text-center text-muted-foreground">
         <Link
        href="/register"
        className="text-gray-400 hover:underline hover:text-primary" 
        >Register?</Link>
      </div>
    </div>
  );
}
