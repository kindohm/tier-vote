import { IMG_HOST } from "@/lib/constants";
import { TierList } from "@/lib/types";
import { useAllVotesForList, VoteDoc } from "../../lib/useVotes";
import Image from "next/image";
import { useMemo, useState } from "react";

// Helper to color-code tiers (tweak as desired)
const tierColor = (tier: string) => {
  switch (tier) {
    case "S":
      return "bg-danger"; // standout
    case "A":
      return "bg-warning text-dark";
    case "B":
      return "bg-success";
    case "C":
      return "bg-primary";
    case "D":
      return "bg-secondary";
    default:
      return "bg-light text-dark";
  }
};

const letterBadge = (tier?: string | null) => {
  if (!tier) return <span className="badge bg-light text-muted">–</span>;
  return <span className={`badge ${tierColor(tier)} fw-semibold`}>{tier}</span>;
};

type Distribution = { tier: string; count: number; percent: number }[];

function DistributionBar({ dist }: { dist: Distribution }) {
  const total = dist.reduce((a, b) => a + b.count, 0) || 1;
  return (
    <div
      className="d-flex w-100"
      style={{ height: 14, overflow: "hidden", borderRadius: 4 }}
    >
      {dist.map((d) => (
        <div
          key={d.tier}
          className={tierColor(d.tier)}
          style={{
            width: `${(d.count / total) * 100}%`,
            fontSize: 10,
            lineHeight: "14px",
            textAlign: "center",
            color: "#fff",
            transition: "width .3s",
          }}
          title={`${d.tier}: ${d.count} (${d.percent}%)`}
        >
          {d.count > 0 ? d.tier : ""}
        </div>
      ))}
    </div>
  );
}

type Props = {
  tierList: TierList;
};

export const VotingResults = ({ tierList }: Props) => {
  const allVotes = useAllVotesForList(tierList.id);
  const [view, setView] = useState<"matrix" | "tiers">("matrix");
  // Only show results after at least one item has a finalized tier assignment.
  const hasPlacedItem = tierList.items.some((i) => !!i.tier);

  const users = useMemo(() => tierList.users, [tierList.users]);
  const userIdToName = useMemo(
    () => Object.fromEntries(users.map((u) => [u.id, u.name])),
    [users]
  );

  const itemVoteMap = useMemo(() => {
    const map: Record<string, VoteDoc[]> = {};
    allVotes.forEach((v) => {
      if (!map[v.itemId]) map[v.itemId] = [];
      map[v.itemId].push(v);
    });
    return map;
  }, [allVotes]);

  const withStats = useMemo(
    () =>
      tierList.items.map((item) => {
        const votes = itemVoteMap[item.id] || [];
        const dist: Distribution = tierList.tiers.map((t) => {
          const count = votes.filter((v) => v.tier === t).length;
          const percent = users.length
            ? Math.round((count / users.length) * 100)
            : 0;
          return { tier: t, count, percent };
        });
        return { item, votes, dist };
      }),
    [tierList.items, tierList.tiers, itemVoteMap, users.length]
  );

  // Sort rows for matrix view: S, A, B, C, D, then unplaced items last.
  const sortedWithStats = useMemo(() => {
    const order = ["S", "A", "B", "C", "D"]; // explicit priority
    const rank = (tier?: string | null) => {
      if (!tier) return 999; // unplaced last
      const idx = order.indexOf(tier);
      return idx === -1 ? 500 : idx; // unknown tiers after known but before unplaced
    };
    return [...withStats].sort((a, b) => {
      const ra = rank(a.item.tier);
      const rb = rank(b.item.tier);
      if (ra !== rb) return ra - rb;
      // Stable fallback: keep original relative order for same tier by index in items
      return (
        tierList.items.findIndex((i) => i.id === a.item.id) -
        tierList.items.findIndex((i) => i.id === b.item.id)
      );
    });
  }, [withStats, tierList.items]);

  const groupedByTier = useMemo(() => {
    const grp: Record<string, typeof withStats> = {};
    withStats.forEach((row) => {
      const t = row.item.tier || "Unplaced";
      if (!grp[t]) grp[t] = [];
      grp[t].push(row);
    });
    return grp;
  }, [withStats]);

  if (!hasPlacedItem) {
    // Show nothing until at least one item placed (unchanged behavior)
    return null;
  }

  const isLoadingMatrix = sortedWithStats.length === 0;

  return (
    <div>
      <div className="d-flex align-items-center mb-3">
        <h3 className="me-auto mb-0">Voting Results</h3>
        <div className="btn-group btn-group-sm" role="group">
          <button
            className={`btn btn-outline-secondary ${
              view === "matrix" ? "active" : ""
            }`}
            onClick={() => setView("matrix")}
          >
            Matrix
          </button>
          <button
            className={`btn btn-outline-secondary ${
              view === "tiers" ? "active" : ""
            }`}
            onClick={() => setView("tiers")}
          >
            By Tier
          </button>
        </div>
      </div>

      {view === "matrix" && (
        <div className="table-responsive">
          <table className="table table-sm align-middle">
            <thead>
              <tr>
                <th style={{ width: 90 }}>Item</th>
                <th>Final</th>
                <th style={{ minWidth: 160 }}>Distribution</th>
                <th style={{ minWidth: 180 }}>Votes</th>
              </tr>
            </thead>
            <tbody>
              {isLoadingMatrix && (
                <>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <tr key={`sk-${i}`}>
                      <td>
                        <span
                          className="skeleton"
                          style={{ width: 64, height: 64, display: "block" }}
                        />
                      </td>
                      <td>
                        <span
                          className="skeleton"
                          style={{ width: 32, height: 20, display: "block" }}
                        />
                      </td>
                      <td>
                        <span
                          className="skeleton"
                          style={{ width: 140, height: 14, display: "block" }}
                        />
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          {Array.from({ length: 3 }).map((__, j) => (
                            <span
                              key={j}
                              className="skeleton"
                              style={{ width: 34, height: 38 }}
                            />
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </>
              )}
              {sortedWithStats.map(({ item, votes, dist }) => {
                const sortedVotes = [...votes].sort((a, b) =>
                  a.tier.localeCompare(b.tier)
                );
                return (
                  <tr key={item.id}>
                    <td>
                      <Image
                        src={`${IMG_HOST}/${decodeURIComponent(
                          item.imageURL ?? ""
                        )}`}
                        alt="item"
                        width={64}
                        height={64}
                        className="rounded border"
                      />
                    </td>
                    <td>{letterBadge(item.tier)}</td>
                    <td>
                      <DistributionBar dist={dist} />
                    </td>
                    <td>
                      <div className="d-flex flex-wrap gap-1">
                        {sortedVotes.length === 0 && (
                          <span className="text-muted small">No votes</span>
                        )}
                        {sortedVotes.map((v) => {
                          const name = userIdToName[v.userId] || "?";
                          // user initials for compact secondary line
                          const initials = name
                            .split(/\s+/)
                            .map((p) => p[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase();
                          return (
                            <span
                              key={v.userId}
                              title={`${name}: ${v.tier}`}
                              className={`badge ${tierColor(
                                v.tier
                              )} d-inline-flex flex-column align-items-center justify-content-center`}
                              style={{
                                minWidth: 34,
                                height: 38,
                                lineHeight: 1.1,
                                letterSpacing: 0.5,
                                padding: "2px 4px",
                              }}
                            >
                              <span style={{ fontSize: 13, fontWeight: 600 }}>
                                {v.tier}
                              </span>
                              <span
                                style={{
                                  fontSize: 9,
                                  fontWeight: 400,
                                  opacity: 0.85,
                                  marginTop: -2,
                                  textTransform: "uppercase",
                                }}
                              >
                                {initials}
                              </span>
                              <span className="visually-hidden"> {name}</span>
                            </span>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="text-muted small mb-0">
            Votes column shows tier badges (sorted). Hover for voter name.
            Distribution bar shows spread across tiers.
          </p>
        </div>
      )}

      {view === "tiers" && (
        <div>
          {tierList.tiers.concat("Unplaced").map((t) => {
            const rows = groupedByTier[t] || [];
            if (!rows.length) return null;
            return (
              <div key={t} className="mb-4">
                <h5 className="mb-2">
                  {letterBadge(t === "Unplaced" ? undefined : t)}{" "}
                  <span className="text-muted small">{t}</span>
                </h5>
                <div className="d-flex flex-wrap gap-3">
                  {rows.map(({ item, dist }) => (
                    <div
                      key={item.id}
                      className="border rounded p-2"
                      style={{ width: 150 }}
                    >
                      <Image
                        src={`${IMG_HOST}/${decodeURIComponent(
                          item.imageURL ?? ""
                        )}`}
                        alt="item"
                        width={120}
                        height={120}
                        className="rounded mb-1"
                      />
                      <DistributionBar dist={dist} />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
