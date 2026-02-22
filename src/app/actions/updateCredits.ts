"use server";

import type { FieldSet } from "airtable";
import { airtableBase, type AirtableUserFields } from "@/lib/airtable";
import { revalidatePath } from "next/cache";

type UserRecordFields = AirtableUserFields & FieldSet;

const USERS_TABLE_NAME = "Users";

export async function incrementCredits(clientId: string, amount: number) {
  const table = airtableBase<UserRecordFields>(USERS_TABLE_NAME);

  const records = await table
    .select({
      maxRecords: 1,
      filterByFormula: `{ClientID} = '${clientId}'`,
    })
    .all();

  const record = records[0];
  if (!record) {
    return;
  }

  const currentCredits = Number(record.fields.Credits ?? 0);
  const newCredits = currentCredits + amount;

  await table.update(record.id, {
    Credits: newCredits,
  } as Partial<UserRecordFields>);

  revalidatePath("/");
}

