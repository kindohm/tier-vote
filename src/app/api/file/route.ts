import * as AWS from "aws-sdk";
import { NextRequest, NextResponse } from "next/server";

const S3_ENDPOINT = process.env.S3_ENDPOINT ?? "nope";
const S3_KEY = process.env.S3_KEY ?? "nope";
const S3_SECRET = process.env.S3_SECRET ?? "nope";
const S3_BUCKET = process.env.S3_BUCKET ?? "nope";

const uploadFile = async (buffer: Buffer) => {
  return new Promise((resolve, reject) => {
    const spacesEndpoint = new AWS.Endpoint(S3_ENDPOINT);
    const s3 = new AWS.S3({
      endpoint: spacesEndpoint,
      accessKeyId: S3_KEY,
      secretAccessKey: S3_SECRET,
    });

    s3.putObject(
      {
        Bucket: S3_BUCKET,
        Key: "path_name.jpg",
        Body: buffer,
        ACL: "public-read",
      },
      (err, data) => {
        if (err) {
          console.error(err);
          reject(err);
        }
        console.log("success uploading to DOS");
        resolve(data);
      }
    );
  });
};

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const file = formData.get("file") as Blob | null;
  if (!file) {
    return NextResponse.json(
      { error: "File blob is required." },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const result = await uploadFile(buffer);
  return NextResponse.json({ message: "ok fine", result });
}
