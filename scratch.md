potential document structure

```
{
    id: string;
    createdAt: date;
    modifiedAt: date;
    title: string;
    tiers: [{ id: string; name: string;}]
    items: [
        {
            id: string;
            imageUrl: string;
            votes: [
                {
                    userId: string;
                    tierId: string;
                }
            ]
        }
    ]
    currentItemId: string
    users: [
        {
            id: string;
            name: string;
        }
    ]
}

```
