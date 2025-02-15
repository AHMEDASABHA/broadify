"use client";
import { SettingsIcon, User2Icon } from "lucide-react";
import {
  GoCheckCircle,
  GoCheckCircleFill,
  GoHome,
  GoHomeFill,
} from "react-icons/go";
import { SidebarMenuButton, SidebarMenu, SidebarMenuItem } from "../ui/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
export const sidebarItems = [
  {
    label: "Home",
    href: "/",
    icon: GoHome,
    activeIcon: GoHomeFill,
  },
  {
    label: "My Tasks",
    href: "/tasks",
    icon: GoCheckCircle,
    activeIcon: GoCheckCircleFill,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: SettingsIcon,
    activeIcon: SettingsIcon,
  },
  {
    label: "Members",
    href: "/members",
    icon: User2Icon,
    activeIcon: User2Icon,
  },
];

export const Navigation = () => {
  const pathname = usePathname();
  const workspaceId = useWorkspaceId();

  const isActive = (href: string) => pathname === href;

  return (
    <SidebarMenu className="mt-2">
      {sidebarItems.map((item) => {
        const fullHref = `/workspaces/${workspaceId}${item.href}`;

        const Icon = isActive(fullHref) ? item.activeIcon : item.icon;
        return (
          <SidebarMenuItem key={item.label}>
            <SidebarMenuButton size="lg" asChild>
              <Link href={fullHref}>
                <div
                  className={cn(
                    "flex items-center font-medium rounded-md gap-2.5 p-4 hover:text-primary transition text-neutral-500",
                    isActive(fullHref) &&
                      "bg-white shadow-sm hover:opacity-100 text-primary"
                  )}
                >
                  <Icon size={24} className="size-6 text-neutral-500" />
                  <span className="text-xl">{item.label}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
};
