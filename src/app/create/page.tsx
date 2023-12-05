"use client";

import { IMG_HOST } from "@/lib/constants";
import { getDb } from "@/lib/getDb";
import { useUser } from "@/lib/useUser";
import { addDoc, collection } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { SetStateAction, useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { v4 } from "uuid";

const defaultTierList = {
  title: "",
  tiers: ["S", "A", "B", "C", "D", "E", "F"],
  items: [
    {
      id: "aaa",
      votes: [],
    },
    { id: "bbb", votes: [] },
  ],
  currentVoteItemId: null,
  users: [],
  inProgress: false,
  closed: false,
};

export default function Page() {
  const user = useUser();
  const [name, setName] = useState<string>("");
  const [paths, setPaths] = useState<string[]>([]);

  const router = useRouter();

  const onDrop = useCallback(async (acceptedFiles: any[]) => {
    const newPaths = await Promise.all(
      acceptedFiles.map(async (file) => {
        const formData = new FormData();
        formData.append("filename", file.name);
        formData.append("file", file);

        const resp = await fetch("/api/file", {
          method: "POST",
          body: formData,
        });

        if (!resp.ok) {
          console.error("something went wrong, check your console.");
          throw new Error("error uploading file");
        }

        const data = await resp.json();
        const path = data.result.path as string;
        return path;
      })
    );

    setPaths(paths.concat(newPaths));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const nameChanged = (e: { target: { value: SetStateAction<string> } }) => {
    setName(e.target.value);
  };

  const create = async () => {
    if (!user) {
      throw new Error("no user");
    }

    const items = paths.map((path) => {
      return {
        id: v4(),
        imageURL: path,
        votes: [],
      };
    });

    const db = getDb();
    const tierListRef = collection(db, "tierlists");
    const doc = {
      ...defaultTierList,
      title: name,
      createdBy: user.uid,
      createdAt: new Date(),
      modifiedAt: new Date(),
      users: [{ id: user.uid }],
      items,
    };
    const result = await addDoc(tierListRef, doc);
    router.push(`/${result.path}`);
  };

  return (
    <div>
      <h2>create</h2>
      <p>
        <label>name</label>
        <input type="text" value={name} onChange={nameChanged} />
      </p>
      <div
        {...getRootProps()}
        style={{ padding: "20px", border: "solid 3px black" }}
      >
        drag files here
      </div>
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
      <p>
        <button onClick={create}>create</button>
      </p>
    </div>
  );
}
