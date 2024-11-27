import { Suspense } from "react";
import { api, HydrateClient } from "~/utils/trpc/server";
import { queryExampleAction } from "./_actions/query-example.action";
import { QueryExample } from "./_components/trpc-examples";

export default function Page() {
  void api.greeting.prefetch();
  return (
    <HydrateClient>
      <form action={queryExampleAction} className="p-8">
        <h1 className="text-lg font-semibold mb-4">Query Example</h1>
        <Suspense fallback="Loading...">
          <QueryExample />
        </Suspense>
      </form>
    </HydrateClient>
  );
}
