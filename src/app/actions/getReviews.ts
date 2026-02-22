"use server";

import type { FieldSet, Records } from "airtable";
import { airtableBase, type AirtableReviewFields } from "@/lib/airtable";

export type Review = {
  id: string;
  nombre: string;
  negocio: string;
  comentario: string;
  estrellas: number;
  fecha: string;
  avatar?: string | null;
};

const TABLE_ID = "tblQttMfSNj3p2PFj";

export async function getReviews(clientId: string): Promise<Review[]> {
  const table = airtableBase<TableFields>(TABLE_ID);

  try {
    const records = (await table
      .select({
        maxRecords: 20,
        // Campos en Airtable están en inglés
        fields: ["Name", "Business", "Review", "Stars", "Date", "Avatar"],
        // Solo reseñas asociadas al clientId indicado
        filterByFormula: `{ClientID} = '${clientId}'`,
        sort: [{ field: "Date", direction: "desc" }],
      })
      .all()) as Records<TableFields>;

    return records.map((record) => {
      const fields = record.fields;

      // Mapeo 1:1 con columnas de Airtable (en inglés):
      // Name, Business, Review, Stars, Date, Avatar
      return {
        id: record.id,
        nombre: (fields.Name ?? "").toString(),
        negocio: (fields.Business ?? "").toString(),
        // En Airtable el campo se llama Review, lo exponemos como comentario al UI
        comentario: (fields.Review ?? "").toString(),
        // Stars puede venir como número o string; lo normalizamos a número
        estrellas: Number(fields.Stars ?? 0),
        fecha: (fields.Date ?? "").toString(),
        avatar: fields.Avatar ?? null,
      };
    });
  } catch (error) {
    // Log completo del error para depurar permisos / 403
    // eslint-disable-next-line no-console
    console.error(
      "[Enterplay] Error al obtener reseñas desde Airtable",
      error
    );
    throw error;
  }
}

type TableFields = AirtableReviewFields & FieldSet;

