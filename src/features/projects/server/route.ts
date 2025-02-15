import { z } from "zod";
import { ID, Query } from "node-appwrite";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { config } from "@/config";
import { sessionMiddleware } from "@/lib/session-middleware";
import { getMember } from "@/features/members/utils/get-member";
import { generateImageUrl } from "@/features/workspaces/utils/generate-image-url";
import { createProjectSchema, updateProjectSchema } from "../schema/validation";
import type { Project } from "../types/project";

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

      const projects = await databases.listDocuments(
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
  });

export default app;
