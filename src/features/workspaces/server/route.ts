import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { ID, Query } from "node-appwrite";

import {
  createWorkspaceSchema,
  updateWorkspaceSchema,
} from "../schema/validation";
import { config } from "@/config";
import { sessionMiddleware } from "@/lib/session-middleware";
import { generateInviteCode } from "@/lib/utils";
import { MemberRole } from "@/features/members/types/role";
import { getMember } from "@/features/members/utils/get-member";
import { generateImageUrl } from "../utils/generate-image-url";
import { z } from "zod";
import { Workspace } from "../types/workspace";

const app = new Hono()
  .get("/", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");

    const members = await databases.listDocuments(
      config.appwrite.databaseId,
      config.appwrite.membersId,
      [Query.equal("userId", user.$id)]
    );

    if (!members.documents || members.documents.length === 0) {
      return c.json({
        success: false,
        documents: [],
      });
    }

    const workspaceIds = members.documents.map((member) => member.workspaceId);

    const workspaces = await databases.listDocuments(
      config.appwrite.databaseId,
      config.appwrite.workspacesId,
      [Query.contains("$id", workspaceIds), Query.orderAsc("$createdAt")]
    );

    return c.json({
      success: true,
      data: workspaces,
    });
  })
  .post(
    "/",
    zValidator("form", createWorkspaceSchema),
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user = c.get("user");

      const { name, image } = c.req.valid("form");

      const uploaderImageUrl = await generateImageUrl(storage, image);

      const workspace = await databases.createDocument(
        config.appwrite.databaseId,
        config.appwrite.workspacesId,
        ID.unique(),
        {
          name,
          userId: user.$id,
          imageUrl: uploaderImageUrl,
          inviteCode: generateInviteCode(6),
        }
      );

      await databases.createDocument(
        config.appwrite.databaseId,
        config.appwrite.membersId,
        ID.unique(),
        {
          workspaceId: workspace.$id,
          userId: user.$id,
          role: MemberRole.ADMIN,
        }
      );

      return c.json({
        success: true,
        data: workspace,
      });
    }
  )
  .patch(
    "/:workspaceId",
    sessionMiddleware,
    zValidator("form", updateWorkspaceSchema),
    async (c) => {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user = c.get("user");

      const { workspaceId } = c.req.param();
      const { name, image } = c.req.valid("form");

      const member = await getMember({
        databases,
        userId: user.$id,
        workspaceId,
      });

      if (!member || member.role !== MemberRole.ADMIN) {
        return c.json(
          {
            success: false,
            message: "You are not authorized to update this workspace",
          },
          401
        );
      }

      let uploaderImageUrl: string | undefined;

      if (image instanceof File) {
        uploaderImageUrl = await generateImageUrl(storage, image);
      } else {
        uploaderImageUrl = image;
      }

      const workspace = await databases.updateDocument(
        config.appwrite.databaseId,
        config.appwrite.workspacesId,
        workspaceId,
        { name, imageUrl: uploaderImageUrl }
      );

      return c.json({
        success: true,
        data: workspace,
      });
    }
  )
  .delete("/:workspaceId", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");

    const { workspaceId } = c.req.param();

    const member = await getMember({
      databases,
      userId: user.$id,
      workspaceId,
    });

    if (!member || member.role !== MemberRole.ADMIN) {
      return c.json(
        {
          success: false,
          message: "You are not authorized to delete this workspace",
        },
        401
      );
    }

    //TODO: Delete all members in the workspace, project, tasks, and files
    await databases.deleteDocument(
      config.appwrite.databaseId,
      config.appwrite.workspacesId,
      workspaceId
    );

    return c.json({
      success: true,
      message: "Workspace deleted successfully",
      data: {
        $id: workspaceId,
      },
    });
  })
  .post("/:workspaceId/reset-invite-code", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");

    const { workspaceId } = c.req.param();

    const member = await getMember({
      databases,
      userId: user.$id,
      workspaceId,
    });

    if (!member || member.role !== MemberRole.ADMIN) {
      return c.json(
        {
          success: false,
          message: "You are not authorized to reset the invite code",
        },
        401
      );
    }

    const workspace = await databases.updateDocument(
      config.appwrite.databaseId,
      config.appwrite.workspacesId,
      workspaceId,
      { inviteCode: generateInviteCode(6) }
    );

    return c.json({
      success: true,
      data: workspace,
    });
  })
  .post(
    "/:workspaceId/join",
    sessionMiddleware,
    zValidator("json", z.object({ inviteCode: z.string() })),
    async (c) => {
      const databases = c.get("databases");
      const user = c.get("user");

      const { workspaceId } = c.req.param();
      const { inviteCode } = c.req.valid("json");

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (member) {
        return c.json(
          {
            success: false,
            message: "You are already a member of this workspace",
          },
          400
        );
      }
      const workspace = await databases.getDocument<Workspace>(
        config.appwrite.databaseId,
        config.appwrite.workspacesId,
        workspaceId
      );

      if (workspace.inviteCode !== inviteCode) {
        return c.json(
          {
            success: false,
            message: "Invalid invite code",
          },
          400
        );
      }

      await databases.createDocument(
        config.appwrite.databaseId,
        config.appwrite.membersId,
        ID.unique(),
        {
          workspaceId,
          userId: user.$id,
          role: MemberRole.MEMBER,
        }
      );

      return c.json({
        success: true,
        data: workspace,
      });
    }
  );

export default app;
