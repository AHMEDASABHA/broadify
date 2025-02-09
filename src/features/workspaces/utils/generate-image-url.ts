// This is a normal function because it performs a specific task of generating an image URL from a file.
// It does not handle HTTP requests or responses, which are characteristics of server actions.

import { ID } from "node-appwrite";
import { config } from "@/config";
import { Storage } from "node-appwrite";

export async function generateImageUrl(
  storage: Storage,
  image: string | File | undefined
) {
  let uploaderImageUrl: string | undefined;

  if (image instanceof File) {
    const file = await storage.createFile(
      config.appwrite.storageImageBucketId,
      ID.unique(),
      image
    );

    const arrayBuffer = await storage.getFilePreview(
      config.appwrite.storageImageBucketId,
      file.$id
    );

    uploaderImageUrl = `data:image/png;base64,${Buffer.from(
      arrayBuffer
    ).toString("base64")}`;
  }

  return uploaderImageUrl;
}
