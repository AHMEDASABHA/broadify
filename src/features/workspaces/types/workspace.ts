import type { Models } from "node-appwrite";
interface SuccessResponse {
  success: true;
  data: Models.DocumentList<Models.Document>;
}

interface FailureResponse {
  success: false;
  data: Models.DocumentList<Models.Document>;
}

export type GetWorkspacesResponse = SuccessResponse | FailureResponse;

export type Workspace = Models.Document & {
  imageUrl: string;
  name: string;
  inviteCode: string;
  userId: string;
};
