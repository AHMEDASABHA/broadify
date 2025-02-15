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
import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import { TaskStatus } from "@/features/tasks/types/task-status";

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
  .get("/:workspaceId", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");
    const { workspaceId } = c.req.param();

    const member = await getMember({
      databases,
      userId: user.$id,
      workspaceId,
    });

    if (!member) {
      return c.json(
        {
          error: "Unauthorized",
        },
        401
      );
    }
    const workspace = await databases.getDocument<Workspace>(
      config.appwrite.databaseId,
      config.appwrite.workspacesId,
      workspaceId
    );

    return c.json({
      success: true,
      data: workspace,
    });
  })
  .get("/:workspaceId/info", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const { workspaceId } = c.req.param();

    const workspace = await databases.getDocument<Workspace>(
      config.appwrite.databaseId,
      config.appwrite.workspacesId,
      workspaceId
    );

    return c.json({
      success: true,
      data: {
        id: workspace.$id,
        name: workspace.name,
        imageUrl: workspace.imageUrl,
        inviteCode: workspace.inviteCode,
      },
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
  )
  .get("/:workspaceId/analytics", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");
    const { workspaceId } = c.req.param();

    const member = await getMember({
      databases,
      userId: user.$id,
      workspaceId,
    });

    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const now = new Date();
    const thisMonthStart = startOfMonth(now);
    const thisMonthEnd = endOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));
    const lastMonthEnd = endOfMonth(subMonths(now, 1));

    const thisMonthTasks = await databases.listDocuments(
      config.appwrite.databaseId,
      config.appwrite.tasksId,
      [
        Query.equal("workspaceId", workspaceId),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );
    const lastMonthTasks = await databases.listDocuments(
      config.appwrite.databaseId,
      config.appwrite.tasksId,
      [
        Query.equal("workspaceId", workspaceId),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ]
    );

    const taskCount = thisMonthTasks.total;
    const lastMonthTaskCount = lastMonthTasks.total;
    const taskDiff = taskCount - lastMonthTaskCount;

    const thisMonthAssignedTasks = await databases.listDocuments(
      config.appwrite.databaseId,
      config.appwrite.tasksId,
      [
        Query.equal("workspaceId", workspaceId),
        Query.equal("assigneeId", member.$id),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );

    const lastMonthAssignedTasks = await databases.listDocuments(
      config.appwrite.databaseId,
      config.appwrite.tasksId,
      [
        Query.equal("workspaceId", workspaceId),
        Query.equal("assigneeId", member.$id),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ]
    );

    const thisMonthAssigneeTaskCount = thisMonthAssignedTasks.total;
    const lastMonthAssigneeTaskCount = lastMonthAssignedTasks.total;
    const assigneeTaskDiff =
      thisMonthAssigneeTaskCount - lastMonthAssigneeTaskCount;

    const thisMonthInCompletedTasks = await databases.listDocuments(
      config.appwrite.databaseId,
      config.appwrite.tasksId,
      [
        Query.equal("workspaceId", workspaceId),
        Query.notEqual("status", TaskStatus.DONE),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );

    const lastMonthInCompletedTasks = await databases.listDocuments(
      config.appwrite.databaseId,
      config.appwrite.tasksId,
      [
        Query.equal("workspaceId", workspaceId),
        Query.notEqual("status", TaskStatus.DONE),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ]
    );

    const thisMonthInCompletedTaskCount = thisMonthInCompletedTasks.total;
    const lastMonthInCompletedTaskCount = lastMonthInCompletedTasks.total;
    const inCompletedTaskDiff =
      thisMonthInCompletedTaskCount - lastMonthInCompletedTaskCount;

    const thisMonthCompletedTasks = await databases.listDocuments(
      config.appwrite.databaseId,
      config.appwrite.tasksId,
      [
        Query.equal("workspaceId", workspaceId),
        Query.equal("status", TaskStatus.DONE),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );

    const lastMonthCompletedTasks = await databases.listDocuments(
      config.appwrite.databaseId,
      config.appwrite.tasksId,
      [
        Query.equal("workspaceId", workspaceId),
        Query.equal("status", TaskStatus.DONE),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ]
    );

    const thisMonthCompletedTaskCount = thisMonthCompletedTasks.total;
    const lastMonthCompletedTaskCount = lastMonthCompletedTasks.total;
    const completedTaskDiff =
      thisMonthCompletedTaskCount - lastMonthCompletedTaskCount;

    const thisMonthOverDueTasks = await databases.listDocuments(
      config.appwrite.databaseId,
      config.appwrite.tasksId,
      [
        Query.equal("workspaceId", workspaceId),
        Query.notEqual("status", TaskStatus.DONE),
        Query.lessThan("dueDate", now.toISOString()),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );

    const lastMonthOverDueTasks = await databases.listDocuments(
      config.appwrite.databaseId,
      config.appwrite.tasksId,
      [
        Query.equal("workspaceId", workspaceId),
        Query.notEqual("status", TaskStatus.DONE),
        Query.lessThan("dueDate", now.toISOString()),
        Query.greaterThanEqual("$createdAt", lastMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", lastMonthEnd.toISOString()),
      ]
    );

    const thisMonthOverDueTaskCount = thisMonthOverDueTasks.total;
    const lastMonthOverDueTaskCount = lastMonthOverDueTasks.total;
    const overDueTaskDiff =
      thisMonthOverDueTaskCount - lastMonthOverDueTaskCount;

    return c.json({
      success: true,
      data: {
        taskCount,
        taskDiff,
        assignedTaskCount: thisMonthAssigneeTaskCount,
        assigneeTaskDiff,
        inCompletedTaskCount: thisMonthInCompletedTaskCount,
        inCompletedTaskDiff,
        completedTaskCount: thisMonthCompletedTaskCount,
        completedTaskDiff,
        overDueTaskCount: thisMonthOverDueTaskCount,
        overDueTaskDiff,
      },
    });
  });

export default app;
