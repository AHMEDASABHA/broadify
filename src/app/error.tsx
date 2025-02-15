"use client";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
export default function ErrorPage() {
  return (
    <div className="flex flex-col gap-4 items-center justify-center h-screen">
      <AlertTriangle className="size-10 text-red-500" />
      <p className="text-sm text-muted-foreground">
        Something went wrong. Please try again.
      </p>
      <Button variant="outline" size="sm" asChild>
        <Link href="/">Back to home</Link>
      </Button>
    </div>
  );
}
