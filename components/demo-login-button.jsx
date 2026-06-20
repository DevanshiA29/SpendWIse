"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSignIn, useUser } from "@clerk/nextjs";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const DEMO_EMAIL = "2k23.csaiml2313992@gmail.com";
const DEMO_PASSWORD = "password";

export function DemoLoginButton({
  className,
  size = "default",
  variant = "default",
  children = "Demo Login",
}) {
  const router = useRouter();
  const { isSignedIn } = useUser();
  const { isLoaded, signIn, setActive } = useSignIn();
  const [loading, setLoading] = useState(false);

  const handleDemoLogin = async () => {
    if (isSignedIn) {
      router.push("/dashboard");
      return;
    }

    if (!isLoaded || !signIn) {
      toast.error("Demo login is still loading. Try again in a moment.");
      return;
    }

    setLoading(true);

    try {
      const result = await signIn.create({
        identifier: DEMO_EMAIL,
        password: DEMO_PASSWORD,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        toast.success("Signed in to the demo workspace.");
        window.location.assign("/dashboard");
        return;
      }

      toast.error("Demo login needs one more verification step.");
      router.push("/sign-in");
    } catch (error) {
      toast.error(error?.errors?.[0]?.message || "Demo login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      size={size}
      variant={variant}
      onClick={handleDemoLogin}
      disabled={loading}
      className={cn("gap-2 rounded-full font-bold", className)}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Sparkles className="h-4 w-4" />
      )}
      {loading ? "Signing in..." : children}
    </Button>
  );
}
