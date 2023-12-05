import * as AWS from "aws-sdk";
import { NextRequest, NextResponse } from "next/server";
import { v4 } from "uuid";
import { format } from "date-fns";

const S3_ENDPOINT = process.env.S3_ENDPOINT ?? "nope";
const S3_KEY = process.env.S3_KEY ?? "nope";
const S3_SECRET = process.env.S3_SECRET ?? "nope";
const S3_BUCKET = process.env.S3_BUCKET ?? "nope";
const S3_FOLDER = "tierlist-images";
const ACL = "public-read";

const getNextPath = (filename: string) => {
  const now = new Date();

  const datePart = format(new Date(), "yyyy-MM-dd");
  const filenameParts = filename.split(".");
  const ext = filenameParts[filenameParts.length - 1];
  const newFilename = `${v4()}.${ext}`;
  const path = `${S3_FOLDER}/${datePart}/${newFilename}`;
  return path;
};

const uploadFile = async (filename: string, buffer: Buffer) => {
  return new Promise((resolve, reject) => {
    const spacesEndpoint = new AWS.Endpoint(S3_ENDPOINT);
    const s3 = new AWS.S3({
      endpoint: spacesEndpoint,
      accessKeyId: S3_KEY,
      secretAccessKey: S3_SECRET,
    });

    const path = getNextPath(filename);

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
  const formData = await req.formData();

  const file = formData.get("file") as Blob | null;
  const filename = formData.get("filename");
  if (!filename) {
    return NextResponse.json(
      { error: "File name is required." },
      { status: 400 }
    );
  }
  if (!file) {
    return NextResponse.json(
      { error: "File blob is required." },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const result = await uploadFile(filename.valueOf() as string, buffer);
  return NextResponse.json({ message: "ok fine", result });
}
