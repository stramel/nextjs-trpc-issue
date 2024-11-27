'use client';

import { api } from "~/utils/trpc/client";

export function QueryExample() {
  const [data] = api.greeting.useSuspenseQuery();
  return (
    <section className="space-y-4">
      <div>
        <p><span className="font-semibold">Data</span>: {data.text}</p>
        <p><span className="font-semibold">Count</span>: {data.count}</p>
      </div>
      <button type="submit" className="bg-purple-800 py-2 px-6 rounded-3xl font-semibold border border-white">
        Submit
      </button>
    </section>
  );
}