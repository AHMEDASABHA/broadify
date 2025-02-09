// app/AuthLayout.tsx
import React from "react";
import NavBar from "@/features/auth/components/nav-bar";
export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-100">
      <div className="max-w-screen-2xl mx-auto p-4">
        <NavBar />
        <div className="flex flex-col items-center justify-center pt-4 md:pt-14">
          {children}
        </div>
      </div>
    </div>
  );
}
