import { S3Client, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME!;

export const generateUploadPresignedUrl = async (
  key: string,
  contentType: string,
  expiresIn: number = 300 // 5 minutes
) => {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key
  });
  
  // For upload, we need PutObjectCommand instead
  const { PutObjectCommand } = await import('@aws-sdk/client-s3');
  const putCommand = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: contentType
  });
  
  return getSignedUrl(s3Client, putCommand, { expiresIn });
};

export const generateDownloadPresignedUrl = async (
  key: string,
  expiresIn: number = 900 // 15 minutes
) => {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key
  });
  
  return getSignedUrl(s3Client, command, { expiresIn });
};

export const deleteFile = async (key: string) => {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key
  });
  
  return s3Client.send(command);
};

export default s3Client;
