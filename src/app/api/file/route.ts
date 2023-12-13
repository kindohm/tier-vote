import * as AWS from "aws-sdk";
import { NextRequest, NextResponse } from "next/server";

const S3_ENDPOINT = process.env.S3_ENDPOINT ?? "nope";
const S3_KEY = process.env.S3_KEY ?? "nope";
const S3_SECRET = process.env.S3_SECRET ?? "nope";
const S3_BUCKET = process.env.S3_BUCKET ?? "nope";
const ACL = "public-read";

const uploadFile = async (path: string, buffer: Buffer) => {
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
        Key: path,
        Body: buffer,
        ACL,
      },
      (err, data) => {
        if (err) {
          console.error(err);
          reject(err);
        }
        console.log("success uploading to DOS");
        resolve({ ...data, path });
      }
    );
  });
};

export async function POST(req: NextRequest) {
  try {
    console.log("POST /api/file");
    const formData = await req.formData();
    const realPath = req.nextUrl.searchParams.get("realPath") ?? "fail";

    const file = formData.get("file") as Blob | null;

    if (!file) {
      console.warn("no file :(");
      return NextResponse.json(
        { error: "File blob is required." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await uploadFile(realPath, buffer);
    return NextResponse.json({ message: "ok fine", result });
  } catch (err) {
    console.error("error uploading!", err);
    return NextResponse.error();
  }
}
