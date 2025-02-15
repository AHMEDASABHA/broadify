import React from "react";
import { SingleWorkspaceClient } from "./client";

export default async function WorkspacePage({
  params,
}: {
  params: Promise<{ workspaceId: string }>;
}) {
  const workspaceId = (await params).workspaceId;
  return <SingleWorkspaceClient workspaceId={workspaceId} />;
}
