"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import logo from "@/assets/images/broad-logo.svg";

export default function NavBar() {
  const pathname = usePathname();
  
  return (
    <nav className="flex justify-between items-start">
      <Image src={logo} alt="logo" width={152} height={56} />
      <Button asChild variant="secondary">
        <Link href={pathname === "/sign-in" ? "/sign-up" : "/sign-in"}>
          {pathname === "/sign-in" ? "Sign Up" : "Sign In"}
        </Link>
      </Button>
    </nav>
  );
}
