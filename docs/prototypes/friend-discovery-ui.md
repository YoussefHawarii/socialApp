# Friend-discovery UI — prototype

Rough wireframe/outline for [Friend-discovery UI design](https://github.com/YoussefHawarii/socialApp/issues/7),
a ticket on the [Facebook-style friend search & request spec map](https://github.com/YoussefHawarii/socialApp/issues/3).

This is a discussion artifact, not implementation — the map runs in spec-only mode, no code lands
from this ticket. Component names below are proposals, not commitments.

## Layout: FriendsPage, top to bottom

```
┌──────────────────────────────────────────────────┐
│  Find friends                                     │
│  ┌──────────────────────────────────────────────┐│
│  │ 🔍  Search by username...                     ││
│  └──────────────────────────────────────────────┘│
└──────────────────────────────────────────────────┘
   replaces SendFriendRequestForm entirely (no more raw-ID input)

┌──────────────────────────────────────────────────┐
│  Requests you sent (2)                            │
│  [avatar] mike_smith                    [Cancel]  │
│  [avatar] alex_wong                     [Cancel]  │
│  — EmptyState "No pending requests" if 0 —         │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│  Incoming requests (1)                            │
│  [avatar] sara_lee            [Accept] [Decline]  │
│  — EmptyState "No pending requests" if 0 —         │
└──────────────────────────────────────────────────┘
   both sections fed by one GET /user/friend-requests call

┌──────────────────────────────────────────────────┐
│  Friends (12)                                     │
│  ...unchanged from today...                       │
└──────────────────────────────────────────────────┘
```

## Search interaction states

```
< 2 chars typed        → no results panel shown at all (idle)
2+ chars, debouncing    → nothing yet (waiting out the ~400ms debounce)
request in flight       → [spinner] "Searching..."
results returned        → result rows (see below) + "Load more" if totalPages > currentPage
0 results                → EmptyState "No users found for '<query>'"
request errored          → ApiErrorAlert (existing shared component)
```

## Search result row — one row, four possible right-hand sides

```
[avatar]  jane_doe                                    [Add Friend]     status: not_friends
[avatar]  mike_smith                                  [Pending] [Cancel]  status: pending_sent
[avatar]  sara_lee                            [Accept] [Decline]        status: pending_received
[avatar]  tom_king                                     Friends          status: friends  (badge, no button)
```

Open question this ticket needs to settle: for `pending_received`, does the row show a literal
"Respond" button that expands to Accept/Decline on click (closer to Facebook's actual two-step
flow), or does it just show Accept/Decline directly since we already have the friendId and both
actions are one call away? Leaning toward direct Accept/Decline — fewer clicks, no real reason for
the extra step here.

## Proposed component shape (naming only, mirrors existing `features/friends` conventions)

- `FriendSearchBar` — input + debounce (~400ms, per the search-endpoint ticket), replaces `SendFriendRequestForm`
- `FriendSearchResultsList` / `FriendSearchResultRow` — one row per the four states above
- `SentRequestsList` — new, mirrors `IncomingRequestsList` but renders `[Cancel]`
- `IncomingRequestsList` — updated to render `userName` + avatar (from the populate fix) with `[Accept] [Decline]` instead of the current raw id + `[Accept]` only
- `useSearchUsers`, `useFriendRequests` (query hooks) — `useCancelFriendRequest`, `useDeclineFriendRequest` (mutation hooks) alongside the existing `useSendFriendRequest`/`useAcceptFriendRequest`

## Scope note

Search lives on the Friends page only for this effort — no global nav search bar. The app has no
existing search infrastructure elsewhere to extend, and nothing in the original ask calls for it;
easy to add later as a separate effort if wanted.
