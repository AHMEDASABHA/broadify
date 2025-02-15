import { ID } from "node-appwrite";
import { config } from "@/config";
import { Storage } from "node-appwrite";

export async function generateImageUrl(
  storage: Storage,
  image: string | File | undefined
) {
  let uploaderImageUrl: string | undefined;
  let arrayBuffer: ArrayBuffer | undefined;

  if (image instanceof File) {
    const file = await storage.createFile(
      config.appwrite.storageImageBucketId,
      ID.unique(),
      image
    );

    const mimeType = image.type || "application/octet-stream";

    if (mimeType === "image/svg+xml") {
      // For SVG files, use getFileView to retrieve the SVG content
      arrayBuffer = await storage.getFileView(
        config.appwrite.storageImageBucketId,
        file.$id
      );
      // Convert ArrayBuffer to Base64
      const base64String = arrayBufferToBase64(arrayBuffer);
      // Create the data URL
      uploaderImageUrl = `data:${mimeType};base64,${base64String}`;
    } else {
      // For other image types, use getFilePreview
      arrayBuffer = await storage.getFilePreview(
        config.appwrite.storageImageBucketId,
        file.$id
      );
      const base64String = arrayBufferToBase64(arrayBuffer);
      uploaderImageUrl = `data:${mimeType};base64,${base64String}`;
    }
  }

  return uploaderImageUrl;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
