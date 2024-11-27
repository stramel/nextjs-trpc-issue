'use server';

import { revalidatePath } from "next/cache";
import { countRef } from "~/server/api/root";

export async function queryExampleAction() {
  countRef.current += 10;
  revalidatePath('/', 'page');
  return undefined;
}