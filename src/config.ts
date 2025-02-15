export const config = {
  appwrite: {
    databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
    workspacesId: process.env.NEXT_PUBLIC_APPWRITE_WORKSPACES_ID!,
    storageImageBucketId:
      process.env.NEXT_PUBLIC_APPWRITE_STORAGE_IMAGE_BUCKET_ID!,
    membersId: process.env.NEXT_PUBLIC_APPWRITE_MEMBERS_ID!,
    projectsId: process.env.NEXT_PUBLIC_APPWRITE_PROJECTS_ID!,
    tasksId: process.env.NEXT_PUBLIC_APPWRITE_TASKS_ID!,
  },
};
