import type { Models } from "node-appwrite";
interface SuccessResponse {
  success: true;
  data: Models.DocumentList<Models.Document>;
}

interface FailureResponse {
  success: false;
  data: Models.DocumentList<Models.Document>;
}

export type GetProjectsResponse = SuccessResponse | FailureResponse;

export type Project = Models.Document & {
  imageUrl: string;
  name: string;
  workspaceId: string;
};
