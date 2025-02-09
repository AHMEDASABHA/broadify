import { z } from "zod";

const createWorkspaceSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  image: z
    .union([
      z.string().transform((val) => (val === "" ? undefined : val)),
      z.instanceof(File),
    ])
    .optional(),
});

const updateWorkspaceSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is needed to be 1 character or more" })
    .optional(),
  image: z
    .union([
      z.string().transform((val) => (val === "" ? undefined : val)),
      z.instanceof(File),
    ])
    .optional(),
});
export { createWorkspaceSchema, updateWorkspaceSchema };
