"use client";
import { formatDistanceToNow } from "date-fns";
import { TierList } from "@/lib/data/types";

interface ParticipatedListsProps {
  lists: TierList[];
  loading: boolean;
}

export const ParticipatedLists = ({
  lists,
  loading,
}: ParticipatedListsProps) => {
  return (
    <div>
      <h3>Tier Lists You Participated In</h3>
      {loading ? (
        <>
          <div className="text-muted small mb-1">Loading...</div>
          <table className="table table-compact">
            <tbody>
              {Array.from({ length: 3 }).map((_, i) => (
                <tr key={i}>
                  <td>
                    <span
                      className="skeleton skeleton-table"
                      style={{
                        display: "inline-block",
                        height: 14,
                        width: 140,
                      }}
                    />
                  </td>
                  <td>
                    <span
                      className="skeleton skeleton-table"
                      style={{ display: "inline-block", height: 14, width: 90 }}
                    />
                  </td>
                  <td>
                    <span
                      className="skeleton skeleton-table"
                      style={{ display: "inline-block", height: 20, width: 70 }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <table className="table table-compact">
          <tbody>
            {lists.map((l) => (
              <tr key={l.id}>
                <td>
                  <a href={`/tierlists/${l.id}`}>{l.title}</a>
                </td>
                <td>
                  <span>{formatDistanceToNow(l.createdAt)} ago</span>
                </td>
                <td>
                  {l.closed ? (
                    <span className="badge bg-success">closed</span>
                  ) : l.inProgress ? (
                    <span className="badge bg-info text-dark">in progress</span>
                  ) : (
                    <span className="badge bg-secondary">pending</span>
                  )}
                </td>
              </tr>
            ))}
            {lists.length === 0 && (
              <tr>
                <td colSpan={3} className="text-muted">
                  No participation yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};
