import Airtable from "airtable";

// Usamos un Personal Access Token (pat...) configurado en .env.local
const apiKey = process.env.AIRTABLE_ACCESS_TOKEN ?? process.env.AIRTABLE_TOKEN;
const baseId = process.env.AIRTABLE_BASE_ID;

if (!apiKey || !baseId) {
  console.warn(
    "[Enterplay] Variables de entorno de Airtable no configuradas correctamente."
  );
}

export const airtableBase = new Airtable({
  // El SDK de Airtable espera el PAT en apiKey
  apiKey,
}).base(baseId ?? "");

export type AirtableReviewFields = {
  // Campos tal como están definidos en Airtable (en inglés)
  Name?: string;
  Business?: string;
  Review?: string;
  Stars?: number;
  Date?: string;
  Avatar?: string;
};

// Tabla de usuarios (Users)
export type AirtableUserFields = {
  Name?: string;
  Email?: string;
  ClientID?: string;
  AppPassword?: string;
  BusinessName?: string;
  Role?: string;
   Credits?: number;
};

