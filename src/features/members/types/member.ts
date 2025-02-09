import type { Models } from "node-appwrite";
import type { MemberRole } from "./role";
interface SuccessResponse {
  success: true;
  data: Models.DocumentList<Models.Document>;
}

interface FailureResponse {
  success: false;
  data: Models.DocumentList<Models.Document>;
}

export type GetMembersResponse = SuccessResponse | FailureResponse;

export type Member = Models.Document & {
  name: string;
  email: string;
  role: MemberRole;
};