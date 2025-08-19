"use client";
import { formatDistanceToNow } from "date-fns";
import { TierList } from "@/lib/data/types";

interface CreatedTierListsProps {
  lists?: TierList[];
  loading: boolean;
  onDelete: (id: string) => void;
  adminsInfo?: { id: string; name: string }[];
  currentUserId?: string;
}

export const CreatedTierLists = ({
  lists,
  loading,
  onDelete,
  adminsInfo,
  currentUserId,
}: CreatedTierListsProps) => {
  return (
    <div>
      {adminsInfo && (
        <div className="mb-4">
          <h4>Admin Users</h4>
          <ul className="small" style={{ paddingLeft: "1rem" }}>
            {adminsInfo.map((a) => (
              <li key={a.id}>
                {a.id === currentUserId ? `${a.name} (you)` : a.name}
              </li>
            ))}
          </ul>
        </div>
      )}
      <h3>Your Created Tier Lists</h3>
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
                        width: 160,
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
                      style={{ display: "inline-block", height: 28, width: 60 }}
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
            {lists?.map((l) => (
              <tr key={l.id}>
                <td>
                  <a href={`/tierlists/${l.id}`}>{l.title}</a>
                </td>
                <td>
                  <span>{formatDistanceToNow(l.createdAt)} ago</span>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => onDelete(l.id)}
                  >
                    delete
                  </button>
                </td>
              </tr>
            ))}
            {(!lists || lists.length === 0) && (
              <tr>
                <td colSpan={3} className="text-muted">
                  You haven't created any tier lists yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};
