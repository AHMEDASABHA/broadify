import { config } from "@/config";
import { getMember } from "../members/utils/get-member";
import { Workspace } from "./types/workspace";
import { createSessionClient } from "@/lib/appwrite";
import { Query } from "node-appwrite";
export async function getWorkspaces() {
  try {
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
  } catch (error) {
    console.error(error);
    return {
      success: false,
      data: { total: 0, documents: [] },
    };
  }
}

export async function getWorkspaceById(workspaceId: string) {
  try {
    const { account, databases } = await createSessionClient();

    const user = await account.get();

    const member = await getMember({
      databases,
      userId: user.$id,
      workspaceId,
    });
    if (!member) {
      return {
        success: false,
        data: null,
      };
    }
    const workspace = await databases.getDocument<Workspace>(
      config.appwrite.databaseId,
      config.appwrite.workspacesId,
      workspaceId
    );
    return {
      success: true,
      data: workspace,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      data: null,
    };
  }
}

export async function getWorkspaceNameById(workspaceId: string) {
  try {
    const { databases } = await createSessionClient();
    
    const workspace = await databases.getDocument<Workspace>(
      config.appwrite.databaseId,
      config.appwrite.workspacesId,
      workspaceId
    );
    return {
      success: true,
      data: workspace.name,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      data: null,
    };
  }
}
