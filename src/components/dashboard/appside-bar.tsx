import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Navigation } from "./navigation";
import Logo from "@/assets/images/logo";
import DottedSeparator from "../dotted-sperator";
import Link from "next/link";
import { WorkspacesSwitchers } from "./workspaces-switchers";
export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/">
          <Logo />
        </Link>
      </SidebarHeader>
      <DottedSeparator />
      <WorkspacesSwitchers />
      <DottedSeparator />
      <SidebarContent>
        <Navigation />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
