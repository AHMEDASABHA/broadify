import { SingleTaskPageClient } from "./client";

export default async function SingleTaskPage({
  params,
}: {
  params: Promise<{ workspaceId: string; taskId: string }>;
}) {
  const { taskId } = await params;
  return <SingleTaskPageClient taskId={taskId} />;
}
