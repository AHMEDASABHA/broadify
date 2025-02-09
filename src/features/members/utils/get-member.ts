import type { Databases } from "node-appwrite";
import { config } from "@/config";
import { Query } from "node-appwrite";
interface GetMemberProps {
  databases: Databases;
  userId: string;
  workspaceId: string;
}

export async function getMember({
  databases,
  userId,
  workspaceId,
}: GetMemberProps) {
  const member = await databases.listDocuments(
    config.appwrite.databaseId,
    config.appwrite.membersId,
    [Query.equal("userId", userId), Query.equal("workspaceId", workspaceId)]
  );

  return member.documents[0];
}
