# Next.js + tRPC Hydration Issue

This example repo shows an issue related to the `trpc` library when using it with `next.js`. It happens when calling `revalidatePath` on a page using `useSuspenseQuery`.
The issue is reproducible when calling `void {query}.prefetch()` on a revalidated page and data is dehydrated, but not hydrated client-side.

## Setup

```bash
npm i
npm run dev
```

## Reproduction Steps

1. Open the browser and navigate to `http://localhost:3000/`.
2. You will see a page containing a "Count" and a submit button that increments the count.
3. Click the submit button, this increments the count by 10 and revalidates the page.
4. The page is revalidated and we see the dehydration logic running (see server logs), but the data is not hydrated client-side, you can also test this with the React Query dev tools.
5. Do a hard-refresh on the page to see the count updated.
