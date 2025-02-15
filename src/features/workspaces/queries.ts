import { config } from "@/config";
import { createSessionClient } from "@/lib/appwrite";
import { Query } from "node-appwrite";
export async function getWorkspaces() {
  const { account, databases } = await createSessionClient();

  const user = await account.get();

  const members = await databases.listDocuments(
    config.appwrite.databaseId,
    config.appwrite.membersId,
    [Query.equal("userId", user.$id)]
  );

  if (!members.documents || members.documents.length === 0) {
    return {
      success: false,
      data: { total: 0, documents: [] },
    };
  }

  const workspaceIds = members.documents.map((member) => member.workspaceId);

  const workspaces = await databases.listDocuments(
    config.appwrite.databaseId,
    config.appwrite.workspacesId,
    [Query.contains("$id", workspaceIds), Query.orderAsc("$createdAt")]
  );
  return {
    success: true,
    data: workspaces,
  };
}
