import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  image: z
    .union([
      z.string().transform((val) => (val === "" ? undefined : val)),
      z.instanceof(File),
    ])
    .optional(),
  workspaceId: z.string().min(1, { message: "Workspace ID is required" }),
});

export const updateProjectSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Minimum 1 character is required" })
    .optional(),
  image: z
    .union([
      z.string().transform((val) => (val === "" ? undefined : val)),
      z.instanceof(File),
    ])
    .optional(),
});
