"use client";
import React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DottedSeparator from "@/components/dotted-sperator";
import { useRouter } from "next/navigation";
import { useJoinWorkspace } from "@/features/workspaces/api/use-join-workspace";
import { useInviteCode } from "../hooks/use-invite-code";
import { useWorkspaceId } from "../hooks/use-workspace-id";

type JoinWorkspaceFormProps = {
  workspaceName: string;
};

export default function JoinWorkspaceForm({
  workspaceName,
}: JoinWorkspaceFormProps) {
  const router = useRouter();
  const inviteCode = useInviteCode();
  const workspaceId = useWorkspaceId();
  const { mutate: joinWorkspace, isPending } = useJoinWorkspace();

  function handleJoinWorkspace() {
    joinWorkspace(
      {
        param: {
          workspaceId: workspaceId,
        },
        json: {
          inviteCode: inviteCode,
        },
      },
      {
        onSuccess: ({ data }) => {
          router.push(`/workspaces/${data.$id}`);
        },
      }
    );
  }
  return (
    <Card className="w-full h-full shadow-none border-none">
      <CardHeader className="p-6">
        <CardTitle className="text-2xl font-bold">Join Workspace</CardTitle>
        <CardDescription>
          You&apos;ve been invited to join <strong>{workspaceName}</strong>{" "}
          workspace.
        </CardDescription>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-y-2 gap-x-4 items-center justify-between gap-4">
          <Button
            variant="outline"
            type="button"
            onClick={() => {
              router.push("/");
            }}
            className="w-full lg:w-fit"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="default"
            size="lg"
            onClick={handleJoinWorkspace}
            disabled={isPending}
            className="w-full lg:w-fit"
          >
            {isPending ? "Joining..." : "Join Workspace"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
