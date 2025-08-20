# Participant Tracking Optimization

## Problem

The `useParticipatedTierLists` query was performing poorly because it used a collection group query across all votes to find lists a user has participated in. This required scanning potentially thousands of vote documents across all tier lists.

## Solution

Implemented a denormalized data structure using a `participants` subcollection under each tier list:

### Data Structure

```
tierLists/{listId}/participants/{userId}
```

Each participant document contains:

```typescript
{
  userId: string;
  firstParticipatedAt: Timestamp;
}
```

### Implementation Changes

1. **Vote Casting (`src/lib/data/useVotes.ts`)**

   - Modified `castVote()` to use a Firestore batch operation
   - When a user casts a vote, it now also adds them to the participants subcollection
   - Uses `{ merge: true }` to make participant creation idempotent

2. **Query Optimization (`src/lib/page-main/hooks/useParticipatedTierLists.ts`)**

   - Changed from querying all votes to querying the participants collection group
   - Extracts tier list IDs from the document paths
   - Much more efficient as it only scans participant documents (1 per user per list)

3. **Security Rules (`firestore.rules`)**
   - Added rules for participants subcollection under both `tierLists/` and `tierlists/` paths
   - Added collection group access rule allowing users to read their own participant records
   - Ensures users can only create/update their own participant records

### Performance Benefits

- **Before**: Collection group query across all votes (potentially thousands of documents)
- **After**: Collection group query across participants (one document per user per list)
- **Improvement**: Significant reduction in documents scanned, especially for users who vote frequently

### Migration

No migration is needed. The system will start working immediately for new votes. Existing data remains intact but won't show up in the "participated lists" until users vote again in those lists.

### Backward Compatibility

The change is fully backward compatible. Existing votes continue to work normally, and the new participant tracking starts working immediately for any new votes cast.
