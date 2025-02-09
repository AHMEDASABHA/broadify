import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { createProjectSchema } from "../schema/validation";

const app = new Hono().post("/", zValidator("json", createProjectSchema), async (c) => {
  const { name } = c.req.valid("json");

  return c.json({ name });
});

export default app;
