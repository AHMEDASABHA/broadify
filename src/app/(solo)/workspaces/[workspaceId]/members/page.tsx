"use client";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, MoreVerticalIcon } from "lucide-react";
import DottedSeparator from "@/components/dotted-sperator";
import { Fragment } from "react";
import { MembersAvatar } from "@/features/members/components/member-avatar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { useDeleteMember } from "@/features/members/api/use-delete-member";
import { useUpdateMember } from "@/features/members/api/use-update-member";
import { MemberRole } from "@/features/members/types/role";
import { useConfirm } from "@/hooks/use-confirm";
import { useRouter } from "next/navigation";

export default function MembersPage() {
  const router = useRouter();
  const workspaceId = useWorkspaceId();

  const { data: members } = useGetMembers({
    workspaceId,
  });

  const [RemoveMemberConfirmDialog, confirmRemoveMember] = useConfirm(
    "Remove Member",
    "Are you sure? This member will be removed from this workspace.",
    "destructive"
  );
  const { mutate: removeMember, isPending: isRemovingMember } =
    useDeleteMember();
  const { mutate: updateMember, isPending: isUpdatingMember } =
    useUpdateMember();

  function handleUpdateMember(memberId: string, role: MemberRole) {
    updateMember({
      param: {
        memberId,
      },
      json: {
        role,
      },
    });
  }

  async function handleRemoveMember(memberId: string) {
    const confirmed = await confirmRemoveMember();
    if (!confirmed) return;
    removeMember({
      param: { memberId },
    });
  }

  return (
    <div className="w-full lg:max-w-xl">
      <Card className="w-full h-full border-none shadow-none">
        <RemoveMemberConfirmDialog />
        <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
          <Button
            variant="outline"
            onClick={() => router.push(`/workspaces/${workspaceId}`)}
          >
            <ArrowLeftIcon className="w-4 h-4 me-2" />
            Back
          </Button>
          <CardTitle className="text-2xl font-bold">Members List</CardTitle>
        </CardHeader>
        <div className="px-7">
          <DottedSeparator />
        </div>
        <CardContent className="p-7">
          <div className="flex flex-col gap-y-4">
            {members?.documents.map((member, index) => (
              <Fragment key={member.$id}>
                <div className="flex items-center gap-2">
                  <MembersAvatar
                    className="size-10"
                    fallbackClassName="text-lg"
                    name={member.name}
                  />
                  <div className="flex flex-col gap-y-1">
                    <p className="text-sm font-medium">{member.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {member.email}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" className="ml-auto">
                        <MoreVerticalIcon className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" side="bottom">
                      <DropdownMenuItem
                        onClick={() =>
                          handleUpdateMember(member.$id, MemberRole.ADMIN)
                        }
                        disabled={isUpdatingMember}
                        className="cursor-pointer font-medium"
                      >
                        Set as Administrator
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          handleUpdateMember(member.$id, MemberRole.MEMBER)
                        }
                        disabled={isUpdatingMember}
                        className="cursor-pointer font-medium"
                      >
                        Set as Member
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleRemoveMember(member.$id)}
                        disabled={isRemovingMember}
                        className="cursor-pointer font-medium text-amber-700"
                      >
                        Remove Member {member.name}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                {index < members.documents.length - 1 && (
                  <Separator className="my-2.5" />
                )}
              </Fragment>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
