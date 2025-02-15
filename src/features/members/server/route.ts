import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import { createAdminClient } from "@/lib/appwrite";
import { sessionMiddleware } from "@/lib/session-middleware";
import { Query } from "node-appwrite";
import { config } from "@/config";
import { getMember } from "../utils/get-member";
import { MemberRole } from "@/features/members/types/role";
import type { Member } from "../types/member";

const app = new Hono()
  .get(
    "/",
    sessionMiddleware,
    zValidator("query", z.object({ workspaceId: z.string() })),
    async (c) => {
      const { users } = await createAdminClient();
      const databases = c.get("databases");
      const user = c.get("user");
      const { workspaceId } = c.req.valid("query");

      const member = await getMember({
        databases,
        userId: user.$id,
        workspaceId,
      });
      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const members = await databases.listDocuments<Member>(
        config.appwrite.databaseId,
        config.appwrite.membersId,
        [Query.equal("workspaceId", workspaceId)]
      );

      const populatedMembers = await Promise.all(
        members.documents.map(async (member) => {
          const user = await users.get(member.userId);
          return {
            ...member,
            name: user.name ?? user.email,
            email: user.email,
          };
        })
      );
      return c.json({
        ...members,
        documents: populatedMembers,
      });
    }
  )
  .delete("/:memberId", sessionMiddleware, async (c) => {
    const { memberId } = c.req.param();
    const user = c.get("user");
    const databases = c.get("databases");

    const memberToDelete = await databases.getDocument(
      config.appwrite.databaseId,
      config.appwrite.membersId,
      memberId
    );

    const allMembersInTheWorkspace = await databases.listDocuments(
      config.appwrite.databaseId,
      config.appwrite.membersId,
      [Query.equal("workspaceId", memberToDelete.workspaceId)]
    );

    const member = await getMember({
      databases,
      userId: user.$id,
      workspaceId: memberToDelete.workspaceId,
    });

    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    if (member.$id !== memberToDelete.$id && member.role !== MemberRole.ADMIN) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    if (allMembersInTheWorkspace.documents.length === 1) {
      return c.json({ error: "Cannot delete the last member" }, 400);
    }

    await databases.deleteDocument(
      config.appwrite.databaseId,
      config.appwrite.membersId,
      memberId
    );

    return c.json({
      success: true,
      data: {
        $id: memberToDelete.$id,
      },
    });
  })
  .patch(
    "/:memberId",
    sessionMiddleware,
    zValidator("json", z.object({ role: z.nativeEnum(MemberRole) })),
    async (c) => {
      const { memberId } = c.req.param();
      const { role } = c.req.valid("json");
      const user = c.get("user");
      const databases = c.get("databases");

      const memberToUpdate = await databases.getDocument(
        config.appwrite.databaseId,
        config.appwrite.membersId,
        memberId
      );

      const allMembersInTheWorkspace = await databases.listDocuments(
        config.appwrite.databaseId,
        config.appwrite.membersId,
        [Query.equal("workspaceId", memberToUpdate.workspaceId)]
      );

      const member = await getMember({
        databases,
        userId: user.$id,
        workspaceId: memberToUpdate.workspaceId,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      if (member.role !== MemberRole.ADMIN) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      if (allMembersInTheWorkspace.documents.length === 1) {
        return c.json({ error: "Cannot downgrade the last admin" }, 400);
      }

      await databases.updateDocument(
        config.appwrite.databaseId,
        config.appwrite.membersId,
        memberId,
        {
          role,
        }
      );

      return c.json({
        success: true,
        data: {
          $id: memberToUpdate.$id,
        },
      });
    }
  );
export default app;
