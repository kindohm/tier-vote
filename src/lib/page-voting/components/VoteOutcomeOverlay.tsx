import { TierItem } from "@/lib/data/types";
import Image from "next/image";
import { IMG_HOST } from "@/lib/constants";
import styles from "./VoteOutcomeOverlay.module.css";
import { TierLetter } from "@/lib/components/board/TierLetter";

interface VoteOutcomeOverlayProps {
  item: TierItem;
  show: boolean;
}

export const VoteOutcomeOverlay = ({ item, show }: VoteOutcomeOverlayProps) => {
  if (!show) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.content}>
        <div className={styles.imageContainer}>
          <Image
            src={`${IMG_HOST}/${decodeURIComponent(item.imageURL ?? "")}`}
            alt="Voted item"
            width={200}
            height={200}
            className={styles.image}
          />
        </div>
        <div className={styles.tierContainer}>
          <TierLetter
            letter={item.tier || "?"}
            style={{
              width: "100px",
              height: "100px",
              fontSize: "64px",
              lineHeight: "100px",
            }}
          />
        </div>
        <div className={styles.emojiContainer}>
          <button className={styles.emojiButton}>❤️</button>
          <button className={styles.emojiButton}>💩</button>
          <button className={styles.emojiButton}>🏈</button>
        </div>
      </div>
    </div>
  );
};
