import { SetStateAction, useCallback, useState } from "react";
import { getDb } from "../../../lib/getDb";
import { addDoc, collection } from "firebase/firestore";
import { useNavigate } from "react-router";
import { useUser } from "../../../lib/useUser";
import { useDropzone } from "react-dropzone";

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
};

export const Create = () => {
  const user = useUser();
  const [name, setName] = useState<string>("");
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        // Do whatever you want with the file contents
        const binaryStr = reader.result;
        console.log(binaryStr);
      };
      reader.readAsArrayBuffer(file);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const nameChanged = (e: { target: { value: SetStateAction<string> } }) => {
    setName(e.target.value);
  };

  const create = async () => {
    if (!user) {
      throw new Error("no user");
    }
    const db = getDb();
    const tierListRef = collection(db, "tierlists");
    const doc = {
      ...defaultTierList,
      title: name,
      createdBy: user.uid,
      createdAt: new Date(),
      modifiedAt: new Date(),
      users: [{ id: user.uid }],
    };
    const result = await addDoc(tierListRef, doc);
    navigate(`/${result.path}`);
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
      <p>
        <button onClick={create}>create</button>
      </p>
    </div>
  );
};
