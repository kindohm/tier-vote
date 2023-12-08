import { updateTierList } from "@/lib/data";
import { TierList } from "@/lib/types";
import { User } from "firebase/auth";
import { useParams } from "next/navigation";
import EasyEdit from "react-easy-edit";

type Props = {
  tierList: TierList | null | undefined;
  user: User | null | undefined;
};

export const Title = ({ tierList, user }: Props) => {
  const params = useParams();
  const { id } = params;

  const isOwner = user?.uid === tierList?.createdBy;
  const saveTitle = async (title: string) => {
    if (!tierList) return;

    await updateTierList(id as string, {
      ...tierList,
      title,
    });
  };

  return (
    <h1>
      {isOwner ? (
        <EasyEdit
          type="text"
          value={tierList?.title}
          onSave={saveTitle}
          onCancel={() => undefined}
          saveButtonLabel="Save"
          cancelButtonLabel="Cancel"
        />
      ) : (
        <span>{tierList?.title}</span>
      )}
    </h1>
  );
};
