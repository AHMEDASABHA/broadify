import { SettingsPageClient } from "./client";
export default async function SettingsPage({
  params,
}: {
  params: Promise<{ workspaceId: string; projectId: string }>;
}) {
  const { projectId } = await params;

  return <SettingsPageClient projectId={projectId} />;
}
