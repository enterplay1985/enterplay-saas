"use server";

import { insertTestLocations } from "@/lib/airtable";

export async function syncGoogleLocations(clientId: string) {
  await insertTestLocations(clientId);
  return true;
}
