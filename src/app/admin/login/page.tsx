"use client";

import * as React from "react";
import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, Eye, EyeOff, Moon, Sun, Loader2, House } from "lucide-react";
import { useTheme } from "@/components/admin/theme-provider";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RequiredFieldLabel } from "@/components/ui/RequiredFieldLabel";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Field } from "@/components/ui/field";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/admin/dashboard";
  const { resolvedTheme, setTheme } = useTheme();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isDark = resolvedTheme === "dark";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Authentication failed. Please check your credentials.");
        setLoading(false);
        return;
      }

      router.push(from === "/admin" ? "/admin/dashboard" : from);
      router.refresh();
    } catch {
      setError("Unable to connect to the authentication service. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background px-6 py-20 text-foreground">
      {/* Top right quick controls */}
      <div className="absolute right-5 top-5 flex items-center gap-2">
        <Button
          asChild
          variant="ghost"
          size="icon-sm"
          aria-label="Back to public site"
          title="Back to public site"
        >
          <Link href="/">
            <House className="size-4" />
          </Link>
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </Button>
      </div>

      <Card className="w-full max-w-[380px] px-2 py-6 shadow-sm">
        <CardHeader>
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="flex items-center justify-center py-1">
              {/* Light Mode Logo */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/Pelican-Mitra-Sejati-logo-HD-transparent.png"
                alt="PELICAN MITRA SEJATI"
                className="block dark:hidden h-14 sm:h-16 w-auto max-w-[280px] object-contain"
              />
              {/* Dark Mode Logo: Keeps red 'PELICAN' & emblem, changes 'MITRA SEJATI' to white */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/Pelican-Mitra-Sejati-logo-HD-white-text.png"
                alt="PELICAN MITRA SEJATI"
                className="hidden dark:block h-14 sm:h-16 w-auto max-w-[280px] object-contain"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mt-2">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              Welcome back
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Sign in to continue to your admin console.
            </p>
          </div>

          <div aria-live="polite" role="status">
            {error && (
              <Alert
                variant="destructive"
                className="mt-4 border-destructive/30 bg-destructive/10"
              >
                <AlertCircle aria-hidden className="size-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>

          <form onSubmit={handleSubmit} className="mt-5">
            <fieldset disabled={loading} className="space-y-4">
              <Field>
                <RequiredFieldLabel htmlFor="username">
                  Email or Username
                </RequiredFieldLabel>
                <Input
                  id="username"
                  type="text"
                  autoComplete="username"
                  placeholder="example"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-10"
                  required
                  autoFocus
                />
              </Field>

              <Field>
                <RequiredFieldLabel htmlFor="password">
                  Password
                </RequiredFieldLabel>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    tabIndex={-1}
                    className="absolute right-0 top-0 flex h-10 w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff aria-hidden className="size-4" />
                    ) : (
                      <Eye aria-hidden className="size-4" />
                    )}
                  </button>
                </div>
              </Field>

              <Button type="submit" className="h-10 w-full text-sm font-medium">
                {loading ? (
                  <>
                    <Loader2 aria-hidden className="size-4 animate-spin" />
                    Signing in…
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </fieldset>
          </form>

          <p className="mt-5 text-center text-xs leading-relaxed text-muted-foreground">
            Trouble signing in? Contact your system administrator.
          </p>
        </CardContent>
      </Card>

      <p className="absolute bottom-6 text-xs text-muted-foreground">
        © {new Date().getFullYear()} PT Pelican Mitra Sejati. All rights reserved.
      </p>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background">
          <Loader2 className="size-6 animate-spin text-primary" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
