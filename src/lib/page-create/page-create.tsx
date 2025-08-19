"use client";

import { IMG_HOST } from "@/lib/constants";
import { getDb } from "@/lib/data/getDb";
import { useUser } from "@/lib/data/useUser";
import { addDoc, collection } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { SetStateAction, useState } from "react";
import { v4 } from "uuid";
import Dropzone, {
  IFileWithMeta,
  IUploadParams,
} from "react-dropzone-uploader";
import { format } from "date-fns";
import { useAdmins } from "@/lib/data/data";

const S3_FOLDER = "tierlist-images";

const defaultTierList = {
  title: "",
  tiers: ["S", "A", "B", "C", "D"],
  items: [
    {
      id: "aaa",
      votes: [],
    },
    { id: "bbb", votes: [] },
  ],
  currentVoteItemId: null,
  pendingVoteItemId: null,
  pendingVoteStartsAt: null,
  users: [],
  inProgress: false,
  closed: false,
};

const getNextPath = (filename: string) => {
  const datePart = format(new Date(), "yyyy-MM-dd");
  const filenameParts = filename.split(".");
  const ext = filenameParts[filenameParts.length - 1];
  const newFilename = `${v4()}.${ext}`;
  const path = `${S3_FOLDER}/${datePart}/${newFilename}`;
  return path;
};

export const CreatePage = () => {
  const admins = useAdmins();
  const user = useUser();
  const isAdmin = admins?.includes(user?.uid);
  const [name, setName] = useState<string>("");
  const [paths, setPaths] = useState<string[]>([]);
  const [progress, setProgress] = useState<string | null>(null);
  const router = useRouter();

  const nameChanged = (e: { target: { value: SetStateAction<string> } }) => {
    setName(e.target.value);
  };

  const create = async (pathss: string[]) => {
    if (!user) {
      throw new Error("no user");
    }
    const items = pathss.map((path) => ({
      id: v4(),
      imageURL: path,
      votes: [],
      modifiedAt: new Date(),
    }));
    const db = getDb();
    const tierListRef = collection(db, "tierlists");
    const doc = {
      ...defaultTierList,
      title: name,
      createdBy: user.uid,
      createdAt: new Date(),
      modifiedAt: new Date(),
      users: [],
      items,
    };
    const result = await addDoc(tierListRef, doc);
    router.push(`/${result.path}`);
  };

  const getUploadParams = (x: IFileWithMeta): IUploadParams => {
    const { meta } = x;
    const realPath = encodeURIComponent(getNextPath(meta.name));
    return {
      url: `/api/file?realPath=${realPath}`,
      meta: { ...meta, realPath },
    };
  };

  const handleChangeStatus = ({ meta }, status) => {
    setProgress(`${status} ${meta.name}`);
  };

  const handleSubmit = async (
    files: IFileWithMeta[],
    allFiles: IFileWithMeta[]
  ) => {
    allFiles.forEach((f) => f.remove());
    // @ts-expect-error it is ok
    setPaths(files.map((f) => f.meta.realPath));
    // @ts-expect-error it is ok
    await create(files.map((f) => f.meta.realPath));
  };

  if (!isAdmin) {
    return (
      <div>
        <h1>nope</h1>
        <p>Sorry. Nope. Can't do this.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>create</h1>
      <div className="row mb-3 mt-3">
        <div className="col-auto">
          <label className="col-form-label">Tier list name:</label>
        </div>
        <div className="col-auto">
          <input
            className="form-control"
            type="text"
            value={name}
            onChange={nameChanged}
          />
        </div>
      </div>
      <Dropzone
        getUploadParams={getUploadParams}
        onChangeStatus={handleChangeStatus}
        onSubmit={handleSubmit}
        accept="image/*"
        maxSizeBytes={1024 * 1024 * 3}
        maxFiles={100}
        submitButtonDisabled={!name}
      />
      <p>{progress ?? " "}</p>
      <ul style={{ display: "flex", flexWrap: "wrap" }}>
        {paths.map((path) => {
          const fullPath = `${IMG_HOST}/${path}`;
          return (
            <li key={path} style={{ listStyleType: "none" }}>
              <img src={fullPath} width="100" height="100" />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default CreatePage;
