"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GalleryVerticalEnd } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/hooks/trpc";
import toast from "react-hot-toast";

interface RegisterFormProps {
  className?: string;
}

export function RegisterForm({ className }: RegisterFormProps) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const registerUser = trpc.auth.register.useMutation({
    onSuccess: () => {
      toast.success("Berhasil daftar");
      router.push("/");
    },
    onError: (err: any) => {
      toast.error("Gagal: " + err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.loading("Loading")
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
            <h1 className="text-xl font-bold">Register to ShopCat Inc.</h1>
          </div>

          <div className="grid gap-3">
            <Label htmlFor="name" className="text-sm">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Your name"
              required
              className="w-full"
              value={form.name}
              onChange={(e : any) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="email" className="text-sm">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              required
              className="w-full"
              value={form.email}
              onChange={(e : any) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="grid gap-3">
            <Label htmlFor="password" className="text-sm">Password</Label>
            <Input
              id="password"
              type="password"
              required
              className="w-full"
              value={form.password}
              onChange={(e : any) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <Button type="submit" className="w-full" variant="default" size="default">
            Register
          </Button>
        </div>
      </form>

      <div className="text-xs text-center text-muted-foreground">
        By continuing, you agree to our{" "}
        <a href="#" className="underline underline-offset-4 hover:text-primary">
          Terms
        </a>{" "}
        and{" "}
        <a href="#" className="underline underline-offset-4 hover:text-primary">
          Privacy Policy
        </a>
        .
      </div>
    </div>
  );
}
