import { z } from "zod";
import { ID, Query } from "node-appwrite";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { config } from "@/config";
import { sessionMiddleware } from "@/lib/session-middleware";
import { createTaskSchema } from "../schema/validation";
import { getMember } from "@/features/members/utils/get-member";
import { TaskStatus } from "../types/task-status";
import { createAdminClient } from "@/lib/appwrite";
import type { Project } from "@/features/projects/types/project";
import type { Member } from "@/features/members/types/member";
import type { Task } from "../types/task";
const app = new Hono()
  .get(
    "/",
    sessionMiddleware,
    zValidator(
      "query",
      z.object({
        workspaceId: z.string(),
        projectId: z.string().nullish(),
        assigneeId: z.string().nullish(),
        status: z.nativeEnum(TaskStatus).nullish(),
        dueDate: z.string().nullish(),
        search: z.string().nullish(),
      })
    ),
    async (c) => {
      const { users } = await createAdminClient();
      const databases = c.get("databases");
      const user = c.get("user");

      const { workspaceId, projectId, assigneeId, status, dueDate, search } =
        c.req.valid("query");

      const member = await getMember({
        databases,
        userId: user.$id,
        workspaceId,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const query = [
        Query.equal("workspaceId", workspaceId),
        Query.orderDesc("$createdAt"),
      ];

      if (projectId) {
        query.push(Query.equal("projectId", projectId));
      }

      if (assigneeId) {
        query.push(Query.equal("assigneeId", assigneeId));
      }

      if (status) {
        query.push(Query.equal("status", status));
      }

      if (dueDate) {
        query.push(Query.equal("dueDate", dueDate));
      }

      if (search) {
        query.push(Query.search("name", search));
      }

      const tasks = await databases.listDocuments<Task>(
        config.appwrite.databaseId,
        config.appwrite.tasksId,
        query
      );

      const projectIds = tasks.documents.map((task) => task.projectId);
      const assigneeIds = tasks.documents.map((task) => task.assigneeId);

      const projects = await databases.listDocuments<Project>(
        config.appwrite.databaseId,
        config.appwrite.projectsId,
        projectIds.length > 0 ? [Query.contains("$id", projectIds)] : []
      );

      const members = await databases.listDocuments<Member>(
        config.appwrite.databaseId,
        config.appwrite.membersId,
        assigneeIds.length > 0 ? [Query.contains("$id", assigneeIds)] : []
      );

      const assignees = await Promise.all(
        members.documents.map(async (member) => {
          const user = await users.get(member.userId);

          return {
            ...member,
            name: user.name,
            email: user.email,
          };
        })
      );

      const popultedTasks = tasks.documents.map((task) => {
        const project = projects.documents.find(
          (project) => project.$id === task.projectId
        );

        const assignee = assignees.find(
          (assignee) => assignee.$id === task.assigneeId
        );

        return {
          ...task,
          project,
          assignee,
        };
      });

      return c.json({
        success: true,
        data: popultedTasks,
      });
    }
  )
  .post(
    "/",
    sessionMiddleware,
    zValidator("json", createTaskSchema),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");

      const {
        name,
        description,
        status,
        workspaceId,
        projectId,
        assigneeId,
        dueDate,
      } = c.req.valid("json");

      const member = await getMember({
        databases,
        userId: user.$id,
        workspaceId,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const highestPositionTask = await databases.listDocuments(
        config.appwrite.databaseId,
        config.appwrite.tasksId,
        [
          Query.equal("status", status),
          Query.equal("workspaceId", workspaceId),
          Query.orderAsc("position"),
          Query.limit(1),
        ]
      );

      const newPosition =
        highestPositionTask.documents.length > 0
          ? highestPositionTask.documents[0].position + 1000
          : 1000;

      const task = await databases.createDocument(
        config.appwrite.databaseId,
        config.appwrite.tasksId,
        ID.unique(),
        {
          name,
          description,
          status,
          workspaceId,
          projectId,
          assigneeId,
          dueDate,
          position: newPosition,
        }
      );

      return c.json({
        success: true,
        data: task,
      });
    }
  )
  .patch(
    "/:taskId",
    sessionMiddleware,
    zValidator("json", createTaskSchema.partial()),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");

      const { name, description, status, projectId, assigneeId, dueDate } =
        c.req.valid("json");

      const { taskId } = c.req.param();

      const existingTask = await databases.getDocument<Task>(
        config.appwrite.databaseId,
        config.appwrite.tasksId,
        taskId
      );

      if (!existingTask) {
        return c.json({ error: "Task not found" }, 404);
      }

      const member = await getMember({
        databases,
        userId: user.$id,
        workspaceId: existingTask.workspaceId,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const task = await databases.updateDocument(
        config.appwrite.databaseId,
        config.appwrite.tasksId,
        taskId,
        {
          name,
          status,
          projectId,
          assigneeId,
          description,
          dueDate,
        }
      );

      return c.json({
        success: true,
        data: task,
      });
    }
  )
  .delete("/:taskId", sessionMiddleware, async (c) => {
    const user = c.get("user");
    const databases = c.get("databases");

    const { taskId } = c.req.param();

    const task = await databases.getDocument<Task>(
      config.appwrite.databaseId,
      config.appwrite.tasksId,
      taskId
    );

    const member = await getMember({
      databases,
      userId: user.$id,
      workspaceId: task.workspaceId,
    });

    if (!member) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    await databases.deleteDocument(
      config.appwrite.databaseId,
      config.appwrite.tasksId,
      taskId
    );

    return c.json({ success: true, data: { id: task.$id } });
  })
  .get("/:taskId", sessionMiddleware, async (c) => {
    const currentUser = c.get("user");
    const databases = c.get("databases");

    const { users } = await createAdminClient();
    const { taskId } = c.req.param();

    const task = await databases.getDocument<Task>(
      config.appwrite.databaseId,
      config.appwrite.tasksId,
      taskId
    );

    if (!task) {
      return c.json({ error: "Task not found" }, 404);
    }

    const currentMember = await getMember({
      databases,
      userId: currentUser.$id,
      workspaceId: task.workspaceId,
    });

    if (!currentMember) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const project = await databases.getDocument<Project>(
      config.appwrite.databaseId,
      config.appwrite.projectsId,
      task.projectId
    );

    const member = await databases.getDocument<Member>(
      config.appwrite.databaseId,
      config.appwrite.membersId,
      task.assigneeId
    );

    const user = await users.get(member.userId);

    const assignee = {
      ...member,
      name: user.name,
      email: user.email,
    };

    return c.json({
      success: true,
      data: {
        ...task,
        project,
        assignee,
      },
    });
  })
  .post(
    "/bulk-update",
    sessionMiddleware,
    zValidator(
      "json",
      z.object({
        tasks: z.array(
          z.object({
            $id: z.string(),
            status: z.nativeEnum(TaskStatus),
            position: z.number().int().positive().min(1000).max(1_000_000),
          })
        ),
      })
    ),
    async (c) => {
      const databases = c.get("databases");
      const { tasks } = c.req.valid("json");
      const user = c.get("user");

      const tasksToUpdate = await databases.listDocuments(
        config.appwrite.databaseId,
        config.appwrite.tasksId,
        [
          Query.contains(
            "$id",
            tasks.map((task) => task.$id)
          ),
        ]
      );

      const workspaceIds = new Set<string>(
        tasksToUpdate.documents.map((task) => task.workspaceId)
      );

      if (workspaceIds.size !== 1) {
        return c.json(
          { error: "All tasks must be in the same workspace" },
          400
        );
      }

      const workspaceId = workspaceIds.values().next().value;

      if (!workspaceId) {
        return c.json({ error: "Workspace not found" }, 404);
      }

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const updatedTasks = await Promise.all(
        tasks.map(async (task) => {
          const { $id, status, position } = task;

          return await databases.updateDocument(
            config.appwrite.databaseId,
            config.appwrite.tasksId,
            $id,
            {
              status,
              position,
            }
          );
        })
      );

      return c.json({ success: true, data: updatedTasks });
    }
  );

export default app;
