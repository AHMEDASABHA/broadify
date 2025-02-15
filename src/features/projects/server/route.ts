import { z } from "zod";
import { ID, Query } from "node-appwrite";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { config } from "@/config";
import { sessionMiddleware } from "@/lib/session-middleware";
import { getMember } from "@/features/members/utils/get-member";
import { generateImageUrl } from "@/features/workspaces/utils/generate-image-url";
import { createProjectSchema, updateProjectSchema } from "../schema/validation";
import { Project } from "../types/project";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import { TaskStatus } from "@/features/tasks/types/task-status";

const app = new Hono()
  .post(
    "/",
    sessionMiddleware,
    zValidator("form", createProjectSchema),
    async (c) => {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user = c.get("user");

      const { name, image, workspaceId } = c.req.valid("form");

      const uploaderImageUrl = await generateImageUrl(storage, image);
      const member = getMember({
        databases,
        userId: user.$id,
        workspaceId,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const project = await databases.createDocument(
        config.appwrite.databaseId,
        config.appwrite.projectsId,
        ID.unique(),
        {
          name,
          imageUrl: uploaderImageUrl,
          workspaceId,
        }
      );

      return c.json({
        success: true,
        data: project,
      });
    }
  )
  .get(
    "/",
    sessionMiddleware,
    zValidator(
      "query",
      z.object({
        workspaceId: z.string().min(1),
      })
    ),
    async (c) => {
      const { workspaceId } = c.req.valid("query");
      const databases = c.get("databases");
      const user = c.get("user");

      if (!workspaceId) {
        return c.json({ error: "Workspace ID is required" }, 400);
      }

      const member = getMember({
        databases,
        userId: user.$id,
        workspaceId,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const projects = await databases.listDocuments<Project>(
        config.appwrite.databaseId,
        config.appwrite.projectsId,
        [Query.equal("workspaceId", workspaceId), Query.orderDesc("$createdAt")]
      );

      return c.json({
        success: true,
        data: projects,
      });
    }
  )
  .get("/:projectId", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");
    const { projectId } = c.req.param();

    const project = await databases.getDocument<Project>(
      config.appwrite.databaseId,
      config.appwrite.projectsId,
      projectId
    );

    const member = await getMember({
      databases,
      userId: user.$id,
      workspaceId: project.workspaceId,
    });

    if (!member) {
      return c.json(
        {
          error: "Unauthorized",
        },
        401
      );
    }

    return c.json({
      success: true,
      data: project,
    });
  })
  .patch(
    "/:projectId",
    sessionMiddleware,
    zValidator("form", updateProjectSchema),
    async (c) => {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user = c.get("user");

      const { projectId } = c.req.param();
      const { name, image } = c.req.valid("form");

      const existingProject = await databases.getDocument<Project>(
        config.appwrite.databaseId,
        config.appwrite.projectsId,
        projectId
      );

      if (!existingProject) {
        return c.json({ error: "Project not found" }, 404);
      }

      const member = await getMember({
        databases,
        userId: user.$id,
        workspaceId: existingProject.data.workspaceId,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      let uploaderImageUrl: string | undefined;

      if (image instanceof File) {
        uploaderImageUrl = await generateImageUrl(storage, image);
      } else {
        uploaderImageUrl = image;
      }

      const project = await databases.updateDocument(
        config.appwrite.databaseId,
        config.appwrite.projectsId,
        projectId,
        { name, imageUrl: uploaderImageUrl }
      );

      return c.json({
        success: true,
        data: project,
      });
    }
  )
  .delete("/:projectId", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");

    const { projectId } = c.req.param();

    const existingProject = await databases.getDocument<Project>(
      config.appwrite.databaseId,
      config.appwrite.projectsId,
      projectId
    );

    if (!existingProject) {
      return c.json({ error: "Project not found" }, 404);
    }

    const member = await getMember({
      databases,
      userId: user.$id,
      workspaceId: existingProject.data.workspaceId,
    });

    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    //TODO: Delete tasks, and files
    await databases.deleteDocument(
      config.appwrite.databaseId,
      config.appwrite.projectsId,
      projectId
    );

    return c.json({
      success: true,
      message: "Workspace deleted successfully",
      data: {
        $id: projectId,
      },
    });
  })
  .get("/:projectId/analytics", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");
    const { projectId } = c.req.param();

    const member = await getMember({
      databases,
      userId: user.$id,
      workspaceId: projectId,
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
        Query.equal("projectId", projectId),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );
    const lastMonthTasks = await databases.listDocuments(
      config.appwrite.databaseId,
      config.appwrite.tasksId,
      [
        Query.equal("projectId", projectId),
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
        Query.equal("projectId", projectId),
        Query.equal("assigneeId", member.$id),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );

    const lastMonthAssignedTasks = await databases.listDocuments(
      config.appwrite.databaseId,
      config.appwrite.tasksId,
      [
        Query.equal("projectId", projectId),
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
        Query.equal("projectId", projectId),
        Query.notEqual("status", TaskStatus.DONE),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );

    const lastMonthInCompletedTasks = await databases.listDocuments(
      config.appwrite.databaseId,
      config.appwrite.tasksId,
      [
        Query.equal("projectId", projectId),
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
        Query.equal("projectId", projectId),
        Query.equal("status", TaskStatus.DONE),
        Query.greaterThanEqual("$createdAt", thisMonthStart.toISOString()),
        Query.lessThanEqual("$createdAt", thisMonthEnd.toISOString()),
      ]
    );

    const lastMonthCompletedTasks = await databases.listDocuments(
      config.appwrite.databaseId,
      config.appwrite.tasksId,
      [
        Query.equal("projectId", projectId),
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
        Query.equal("projectId", projectId),
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
        Query.equal("projectId", projectId),
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
