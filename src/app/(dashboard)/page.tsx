import { getWorkspaces } from "@/features/workspaces/queries";
import { redirect } from "next/navigation";
export default async function Home() {
  const workspaces = await getWorkspaces();

  if (!workspaces.success) {
    redirect("/workspaces/create");
  } else if (workspaces.success && workspaces.data.total === 0) {
    redirect("/workspaces/create");
  } else if (workspaces.success && workspaces.data.total > 0) {
    console.log(workspaces.data.documents[0].$id);
    redirect(`/workspaces/${workspaces.data.documents[0].$id}`);
  }
}
